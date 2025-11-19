import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createMeeting } from '@/lib/video-providers'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Neautorizirano' },
        { status: 401 }
      )
    }

    const { tutorId, subjectId, scheduledAt, duration, videoProvider, notes } = await req.json()

    // VALIDATION: Duration must be between 15 minutes and 8 hours (480 min)
    if (!duration || typeof duration !== 'number') {
      return NextResponse.json(
        { error: 'Duration is required and must be a number' },
        { status: 400 }
      )
    }

    if (duration < 15 || duration > 480) {
      return NextResponse.json(
        { error: 'Duration must be between 15 and 480 minutes' },
        { status: 400 }
      )
    }

    // Get tutor details
    const tutor = await prisma.user.findUnique({
      where: { id: tutorId },
      include: {
        tutorProfile: true,
      },
    })

    if (!tutor || !tutor.tutorProfile) {
      return NextResponse.json(
        { error: 'Instruktor nije pronađen' },
        { status: 404 }
      )
    }

    // VALIDATION: Hourly rate must be positive and reasonable
    const hourlyRate = tutor.tutorProfile.hourlyRate
    if (hourlyRate <= 0 || hourlyRate > 1000) {
      return NextResponse.json(
        { error: 'Invalid tutor hourly rate' },
        { status: 400 }
      )
    }

    // Create video meeting
    const meeting = await createMeeting(videoProvider, {
      topic: `Instrukcija - ${session.user.name}`,
      startTime: new Date(scheduledAt),
      duration,
      tutorEmail: tutor.email,
      studentEmail: session.user.email!,
    })

    // PRICE CALCULATION: Always calculate server-side, never trust client
    // Round to 2 decimal places to prevent floating point issues
    const price = Math.round(hourlyRate * (duration / 60) * 100) / 100

    // VALIDATION: Final price check
    if (price <= 0 || price > 10000) {
      return NextResponse.json(
        { error: 'Calculated price is invalid' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        studentId: session.user.id,
        tutorId,
        subjectId,
        scheduledAt: new Date(scheduledAt),
        duration,
        videoProvider,
        meetingUrl: meeting.meetingUrl,
        meetingId: meeting.meetingId,
        meetingPassword: meeting.password,
        price,
        studentNotes: notes,
      },
      include: {
        tutor: {
          include: {
            tutorProfile: true,
          },
        },
        subject: true,
      },
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        userId: session.user.id,
        amount: price,
        currency: 'EUR',
      },
    })

    // Create notification for tutor
    await prisma.notification.create({
      data: {
        userId: tutorId,
        type: 'booking_received',
        title: 'Nova rezervacija',
        message: `${session.user.name} je zakazao/la instrukciju`,
        data: JSON.stringify({ bookingId: booking.id }),
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Greška pri kreiranju rezervacije' },
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

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { studentId: session.user.id },
          { tutorId: session.user.id },
        ],
      },
      include: {
        student: true,
        tutor: {
          include: {
            tutorProfile: true,
          },
        },
        subject: true,
        payment: true,
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Greška pri dohvaćanju rezervacija' },
      { status: 500 }
    )
  }
}
