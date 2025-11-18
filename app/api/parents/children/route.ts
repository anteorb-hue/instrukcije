import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

/**
 * GET /api/parents/children
 * Returns all children linked to the authenticated parent
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Forbidden - Only parents can access this endpoint' }, { status: 403 })
    }

    // Get parent's children with their profiles and bookings
    const parentChildren = await prisma.parentChild.findMany({
      where: {
        parentId: session.user.id,
      },
      include: {
        child: {
          include: {
            studentProfile: true,
            bookingsAsStudent: {
              include: {
                subject: true,
                tutor: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
              orderBy: {
                scheduledAt: 'desc',
              },
              take: 10, // Last 10 bookings per child
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Transform data for frontend
    const children = parentChildren.map((pc) => ({
      linkId: pc.id,
      relationship: pc.relationship,
      isPrimary: pc.isPrimary,
      canBook: pc.canBook,
      canViewProgress: pc.canViewProgress,
      child: {
        id: pc.child.id,
        name: pc.child.name,
        email: pc.child.email,
        avatar: pc.child.avatar,
        phone: pc.child.phone,
        studentProfile: pc.child.studentProfile,
        recentBookings: pc.child.bookingsAsStudent,
      },
    }))

    return NextResponse.json(children)
  } catch (error) {
    console.error('Error fetching children:', error)
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 })
  }
}

/**
 * POST /api/parents/children
 * Links a child to the authenticated parent or creates a new child account
 *
 * Body can contain either:
 * 1. { childId: "existing-child-id", relationship: "Mother", ... } - Link existing child
 * 2. { email: "new@email.com", name: "Child Name", ... } - Create new child and link
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Forbidden - Only parents can access this endpoint' }, { status: 403 })
    }

    const body = await request.json()
    const {
      childId,
      email,
      name,
      password,
      phone,
      educationLevel,
      interests,
      learningGoals,
      relationship,
      isPrimary,
      canBook,
      canViewProgress,
    } = body

    let finalChildId = childId

    // If childId is not provided, create a new student account
    if (!childId) {
      if (!email || !name || !password) {
        return NextResponse.json(
          { error: 'Missing required fields: email, name, password' },
          { status: 400 }
        )
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
      }

      // Create new student user
      const hashedPassword = await hash(password, 10)
      const newChild = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          phone: phone || null,
          role: 'STUDENT',
          studentProfile: {
            create: {
              educationLevel: educationLevel || 'OSNOVNA_SKOLA',
              interests: interests || [],
              learningGoals: learningGoals || null,
            },
          },
        },
      })

      finalChildId = newChild.id
    } else {
      // Verify that the child exists and is a student
      const child = await prisma.user.findUnique({
        where: { id: childId },
      })

      if (!child) {
        return NextResponse.json({ error: 'Child not found' }, { status: 404 })
      }

      if (child.role !== 'STUDENT') {
        return NextResponse.json({ error: 'User is not a student' }, { status: 400 })
      }

      // Check if link already exists
      const existingLink = await prisma.parentChild.findUnique({
        where: {
          parentId_childId: {
            parentId: session.user.id,
            childId: childId,
          },
        },
      })

      if (existingLink) {
        return NextResponse.json({ error: 'Child is already linked to this parent' }, { status: 400 })
      }
    }

    // Create parent-child link
    const parentChild = await prisma.parentChild.create({
      data: {
        parentId: session.user.id,
        childId: finalChildId,
        relationship: relationship || null,
        isPrimary: isPrimary ?? false,
        canBook: canBook ?? true,
        canViewProgress: canViewProgress ?? true,
      },
      include: {
        child: {
          include: {
            studentProfile: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Child linked successfully',
      data: {
        linkId: parentChild.id,
        relationship: parentChild.relationship,
        isPrimary: parentChild.isPrimary,
        canBook: parentChild.canBook,
        canViewProgress: parentChild.canViewProgress,
        child: {
          id: parentChild.child.id,
          name: parentChild.child.name,
          email: parentChild.child.email,
          avatar: parentChild.child.avatar,
          phone: parentChild.child.phone,
          studentProfile: parentChild.child.studentProfile,
        },
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding child:', error)
    return NextResponse.json({ error: 'Failed to add child' }, { status: 500 })
  }
}
