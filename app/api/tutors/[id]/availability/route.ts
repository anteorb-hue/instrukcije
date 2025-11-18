import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tutors/[id]/availability - Get tutor's availability
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const tutorProfile = await prisma.tutorProfile.findFirst({
      where: { userId: params.id },
      include: {
        availability: {
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        },
      },
    })

    if (!tutorProfile) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 })
    }

    return NextResponse.json(tutorProfile.availability)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}

// POST /api/tutors/[id]/availability - Add availability slot
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { dayOfWeek, startTime, endTime } = body

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'dayOfWeek, startTime, and endTime are required' },
        { status: 400 }
      )
    }

    // Validate dayOfWeek (0-6)
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json({ error: 'dayOfWeek must be between 0 and 6' }, { status: 400 })
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: 'Time must be in HH:mm format' },
        { status: 400 }
      )
    }

    // Get tutor profile
    const tutorProfile = await prisma.tutorProfile.findFirst({
      where: { userId: params.id },
    })

    if (!tutorProfile) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 })
    }

    // Check for overlapping time slots
    const overlapping = await prisma.availability.findFirst({
      where: {
        tutorProfileId: tutorProfile.id,
        dayOfWeek,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    })

    if (overlapping) {
      return NextResponse.json(
        { error: 'Time slot overlaps with existing availability' },
        { status: 400 }
      )
    }

    const availability = await prisma.availability.create({
      data: {
        tutorProfileId: tutorProfile.id,
        dayOfWeek,
        startTime,
        endTime,
      },
    })

    return NextResponse.json(availability, { status: 201 })
  } catch (error) {
    console.error('Error creating availability:', error)
    return NextResponse.json({ error: 'Failed to create availability' }, { status: 500 })
  }
}

// DELETE /api/tutors/[id]/availability?slotId=xxx - Delete availability slot
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const slotId = searchParams.get('slotId')

    if (!slotId) {
      return NextResponse.json({ error: 'slotId is required' }, { status: 400 })
    }

    // Verify the slot belongs to this tutor
    const slot = await prisma.availability.findUnique({
      where: { id: slotId },
      include: {
        tutorProfile: true,
      },
    })

    if (!slot) {
      return NextResponse.json({ error: 'Availability slot not found' }, { status: 404 })
    }

    if (slot.tutorProfile.userId !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.availability.delete({
      where: { id: slotId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting availability:', error)
    return NextResponse.json({ error: 'Failed to delete availability' }, { status: 500 })
  }
}

// PUT /api/tutors/[id]/availability - Bulk update availability (replace all)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { availability } = body

    if (!Array.isArray(availability)) {
      return NextResponse.json({ error: 'availability must be an array' }, { status: 400 })
    }

    // Get tutor profile
    const tutorProfile = await prisma.tutorProfile.findFirst({
      where: { userId: params.id },
    })

    if (!tutorProfile) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 })
    }

    // Delete all existing availability
    await prisma.availability.deleteMany({
      where: { tutorProfileId: tutorProfile.id },
    })

    // Create new availability slots
    if (availability.length > 0) {
      await prisma.availability.createMany({
        data: availability.map((slot: any) => ({
          tutorProfileId: tutorProfile.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      })
    }

    // Fetch and return updated availability
    const updatedAvailability = await prisma.availability.findMany({
      where: { tutorProfileId: tutorProfile.id },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })

    return NextResponse.json(updatedAvailability)
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 })
  }
}
