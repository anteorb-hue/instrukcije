import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rewardReview } from '@/lib/rewards'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Neautorizirano' },
        { status: 401 }
      )
    }

    const { bookingId, rating, comment, communication, expertise, punctuality } = await req.json()

    // Verify booking exists and session is completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Rezervacija nije pronađena' },
        { status: 404 }
      )
    }

    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Možete ocijeniti samo završene sesije' },
        { status: 400 }
      )
    }

    // Determine who is being reviewed
    const reviewedId = booking.studentId === session.user.id
      ? booking.tutorId
      : booking.studentId

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId,
        reviewerId: session.user.id,
        reviewedId,
        rating,
        comment,
        communication,
        expertise,
        punctuality,
      },
    })

    // Update tutor's average rating
    if (reviewedId === booking.tutorId) {
      const tutorReviews = await prisma.review.findMany({
        where: { reviewedId },
      })

      const averageRating =
        tutorReviews.reduce((sum, r) => sum + r.rating, 0) / tutorReviews.length

      await prisma.tutorProfile.update({
        where: { userId: reviewedId },
        data: { averageRating },
      })
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: reviewedId,
        type: 'review_received',
        title: 'Nova recenzija',
        message: `Dobili ste ocjenu ${rating}/5`,
        data: JSON.stringify({ reviewId: review.id }),
      },
    })

    // Award points for review
    try {
      await rewardReview(review.id)
      console.log('Points awarded for review:', review.id)
    } catch (error) {
      console.error('Error awarding points for review:', error)
      // Don't fail the request if points awarding fails
    }

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Greška pri kreiranju recenzije' },
      { status: 500 }
    )
  }
}
