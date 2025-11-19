import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/auth-middleware'
import { auditHelpers } from '@/lib/audit-logger'
import { updateUserSchema, safeValidateRequest } from '@/lib/validation-schemas'

// GET /api/admin/users/[id] - Get single user (Admin only)
export const GET = withAdmin(async (req: NextRequest, session, { params }: { params: { id: string } }) => {
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
})

// PUT /api/admin/users/[id] - Update user (Admin only)
export const PUT = withAdmin(async (req: NextRequest, session, { params }: { params: { id: string } }) => {
  try {
    const body = await req.json()

    // INPUT VALIDATION: Use Zod schema to validate request body
    const validation = safeValidateRequest(updateUserSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        },
        { status: 400 }
      )
    }

    const { role, name, email, phone, bio, avatar } = validation.data

    // Get old user data for audit log
    const oldUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { role: true, name: true, email: true },
    })

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

    // Audit log the update
    await auditHelpers.userUpdated(params.id, session.user, body)

    // Audit log role change separately if role changed
    if (role && oldUser && oldUser.role !== role) {
      await auditHelpers.userRoleChanged(params.id, oldUser.role, role, session.user)
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
})

// DELETE /api/admin/users/[id] - Delete user (Admin only)
export const DELETE = withAdmin(async (req: NextRequest, session, { params }: { params: { id: string } }) => {
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

    // DATA INTEGRITY: Prevent deletion if user has bookings to preserve historical data
    if (user._count.bookingsAsStudent > 0 || user._count.bookingsAsTutor > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete user with existing bookings. Consider deactivating the account instead.',
          bookings: {
            asStudent: user._count.bookingsAsStudent,
            asTutor: user._count.bookingsAsTutor,
          },
        },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: params.id },
    })

    // Audit log the deletion
    await auditHelpers.userDeleted(params.id, user.email, session.user)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
})
