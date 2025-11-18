import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/subjects/[id] - Get single subject
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: params.id },
      include: {
        tutors: {
          include: {
            tutorProfile: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            tutors: true,
            bookings: true,
          },
        },
      },
    })

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error fetching subject:', error)
    return NextResponse.json({ error: 'Failed to fetch subject' }, { status: 500 })
  }
}

// PUT /api/subjects/[id] - Update subject (Admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { name, nameEn, description, icon, category } = body

    const subject = await prisma.subject.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(nameEn && { nameEn }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(category && { category }),
      },
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 })
  }
}

// DELETE /api/subjects/[id] - Delete subject (Admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check if subject is being used
    const subject = await prisma.subject.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            tutors: true,
            bookings: true,
          },
        },
      },
    })

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    if (subject._count.tutors > 0 || subject._count.bookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete subject that is being used by tutors or bookings' },
        { status: 400 }
      )
    }

    await prisma.subject.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 })
  }
}
