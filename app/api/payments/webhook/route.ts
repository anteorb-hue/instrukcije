import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('Webhook signature verification failed:', errorMessage)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.bookingId

        if (bookingId) {
          // Update payment status
          await prisma.payment.updateMany({
            where: {
              booking: { id: bookingId },
              stripeSessionId: session.id,
            },
            data: {
              status: 'COMPLETED',
              stripePaymentIntentId: session.payment_intent as string,
            },
          })

          // Update booking status
          await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' },
          })

          // Get booking details for notification
          const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
              student: true,
            },
          })

          if (booking) {
            // Create notification for tutor
            await prisma.notification.create({
              data: {
                userId: booking.tutorId,
                type: 'payment_received',
                title: 'Plaćanje potvrđeno',
                message: `${booking.student.name} je platio/la instrukciju`,
                data: JSON.stringify({ bookingId }),
              },
            })
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await prisma.payment.updateMany({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: 'FAILED',
          },
        })
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge

        await prisma.payment.updateMany({
          where: {
            stripePaymentIntentId: charge.payment_intent as string,
          },
          data: {
            status: 'REFUNDED',
          },
        })
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
