import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users - List all users (Admin only)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')
    const verified = searchParams.get('verified')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where: any = {
      ...(role && { role: role as any }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    // If filtering by verified tutors
    if (verified !== null && role === 'TUTOR') {
      where.tutorProfile = {
        verified: verified === 'true',
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          tutorProfile: {
            include: {
              _count: {
                select: {
                  subjects: true,
                },
              },
            },
          },
          studentProfile: true,
          parentProfile: true,
          userPoints: true,
          _count: {
            select: {
              bookingsAsStudent: true,
              bookingsAsTutor: true,
              reviews: true,
              receivedReviews: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
