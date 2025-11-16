import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Neautorizirano' },
        { status: 401 }
      )
    }

    const { bookingId } = await req.json()

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tutor: {
          include: {
            tutorProfile: true,
          },
        },
        subject: true,
        payment: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Rezervacija nije pronađena' },
        { status: 404 }
      )
    }

    if (booking.studentId !== session.user.id) {
      return NextResponse.json(
        { error: 'Nemate pristup ovoj rezervaciji' },
        { status: 403 }
      )
    }

    // Check if already paid
    if (booking.payment?.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Rezervacija je već plaćena' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Instrukcija - ${booking.subject.name}`,
              description: `${booking.duration} minuta s ${booking.tutor.name}`,
            },
            unit_amount: Math.round(booking.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/bookings?payment=success&bookingId=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/bookings?payment=cancelled`,
      metadata: {
        bookingId,
        userId: session.user.id,
      },
    })

    // Update payment with Stripe session ID
    await prisma.payment.update({
      where: { id: booking.payment!.id },
      data: {
        stripeSessionId: checkoutSession.id,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Greška pri procesuiranju plaćanja' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Neautorizirano' },
        { status: 401 }
      )
    }

    const payments = await prisma.payment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        booking: {
          include: {
            tutor: true,
            subject: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Greška pri dohvaćanju plaćanja' },
      { status: 500 }
    )
  }
}
