import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users/[id] - Get single user (Admin only)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        tutorProfile: {
          include: {
            subjects: {
              include: {
                subject: true,
              },
            },
            availability: true,
            _count: {
              select: {
                subjects: true,
              },
            },
          },
        },
        studentProfile: true,
        parentProfile: true,
        userPoints: {
          include: {
            transactions: {
              take: 10,
              orderBy: { createdAt: 'desc' },
            },
            rewards: {
              where: { used: false },
            },
          },
        },
        bookingsAsStudent: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            tutor: {
              select: { id: true, name: true, avatar: true },
            },
            subject: true,
          },
        },
        bookingsAsTutor: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            student: {
              select: { id: true, name: true, avatar: true },
            },
            subject: true,
          },
        },
        receivedReviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        _count: {
          select: {
            bookingsAsStudent: true,
            bookingsAsTutor: true,
            reviews: true,
            receivedReviews: true,
            materials: true,
            testsCreated: true,
            homeworkQuestions: true,
            homeworkAnswers: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/users/[id] - Update user (Admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { role, name, email, phone, bio, avatar } = body

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(role && { role }),
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
    })

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user (Admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            bookingsAsStudent: true,
            bookingsAsTutor: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Optional: Prevent deletion if user has bookings
    // if (user._count.bookingsAsStudent > 0 || user._count.bookingsAsTutor > 0) {
    //   return NextResponse.json(
    //     { error: 'Cannot delete user with existing bookings' },
    //     { status: 400 }
    //   )
    // }

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}
