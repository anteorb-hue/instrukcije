import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export async function createCheckoutSession(params: {
  tutorId: string
  studentId: string
  bookingId: string
  amount: number
  currency?: string
}) {
  const { tutorId, studentId, bookingId, amount, currency = 'EUR' } = params

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: 'Instrukcija',
            description: `Plaćanje za instrukciju`,
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/bookings/${bookingId}?payment=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/bookings/${bookingId}?payment=cancelled`,
    metadata: {
      bookingId,
      tutorId,
      studentId,
    },
  })

  return session
}

export async function refundPayment(paymentIntentId: string) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  })

  return refund
}
