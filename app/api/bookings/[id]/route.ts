import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rewardLessonCompletion, applyPenalty } from '@/lib/rewards'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Neautorizirano' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        tutor: {
          include: {
            tutorProfile: true,
          },
        },
        subject: true,
        payment: true,
        review: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Rezervacija nije pronađena' },
        { status: 404 }
      )
    }

    // Verify user has access to this booking
    if (booking.studentId !== session.user.id && booking.tutorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Nemate pristup ovoj rezervaciji' },
        { status: 403 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Greška pri dohvaćanju rezervacije' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Neautorizirano' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { scheduledAt, duration, status, studentNotes, tutorNotes } = body

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Rezervacija nije pronađena' },
        { status: 404 }
      )
    }

    // Verify user has permission to update
    if (existingBooking.studentId !== session.user.id && existingBooking.tutorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Nemate dozvolu za izmjenu ove rezervacije' },
        { status: 403 }
      )
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(duration && { duration }),
        ...(status && { status }),
        ...(studentNotes !== undefined && { studentNotes }),
        ...(tutorNotes !== undefined && { tutorNotes }),
      },
      include: {
        student: true,
        tutor: {
          include: {
            tutorProfile: true,
          },
        },
        subject: true,
      },
    })

    // Award points if lesson completed
    if (status === 'COMPLETED' && existingBooking.status !== 'COMPLETED') {
      try {
        await rewardLessonCompletion(params.id)
        console.log('Points awarded for completed lesson:', params.id)
      } catch (error) {
        console.error('Error awarding points for completed lesson:', error)
        // Don't fail the request if points awarding fails
      }
    }

    // Create notification if reschedule
    if (scheduledAt) {
      const recipientId = existingBooking.studentId === session.user.id
        ? existingBooking.tutorId
        : existingBooking.studentId

      await prisma.notification.create({
        data: {
          userId: recipientId,
          type: 'booking_rescheduled',
          title: 'Sesija prešedulirana',
          message: `Sesija je prešedulirana na ${new Date(scheduledAt).toLocaleString('hr-HR')}`,
          data: JSON.stringify({ bookingId: params.id }),
        },
      })
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Greška pri ažuriranju rezervacije' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Neautorizirano' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        payment: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Rezervacija nije pronađena' },
        { status: 404 }
      )
    }

    // Only student can cancel or if not yet confirmed
    if (booking.studentId !== session.user.id) {
      return NextResponse.json(
        { error: 'Samo student može otkazati rezervaciju' },
        { status: 403 }
      )
    }

    // Check if cancellation is allowed (e.g., at least 24h before)
    const hoursUntilSession = (booking.scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60)
    const isLateCancellation = hoursUntilSession < 24

    if (isLateCancellation) {
      // Apply penalty for late cancellation but still allow it
      try {
        await applyPenalty(
          session.user.id,
          'LATE_CANCELLATION',
          'Otkazivanje instrukcije manje od 24h prije termina',
          { bookingId: params.id }
        )
        console.log('Late cancellation penalty applied to user:', session.user.id)
      } catch (error) {
        console.error('Error applying late cancellation penalty:', error)
      }
    }

    // Update booking status to cancelled
    await prisma.booking.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    })

    // Update payment status
    if (booking.payment) {
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: { status: 'REFUNDED' },
      })
    }

    // Create notification for tutor
    await prisma.notification.create({
      data: {
        userId: booking.tutorId,
        type: 'booking_cancelled',
        title: 'Sesija otkazana',
        message: 'Student je otkazao sesiju',
        data: JSON.stringify({ bookingId: params.id }),
      },
    })

    return NextResponse.json({ message: 'Rezervacija uspješno otkazana' })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { error: 'Greška pri otkazivanju rezervacije' },
      { status: 500 }
    )
  }
}
