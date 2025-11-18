import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tests/[id]/submissions - List submissions for a test
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    const isGraded = searchParams.get('isGraded')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      testId: params.id,
      ...(studentId && { studentId }),
      ...(isGraded !== null && isGraded !== undefined && {
        isGraded: isGraded === 'true',
      }),
    }

    const [submissions, total] = await Promise.all([
      prisma.testSubmission.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true,
            },
          },
          test: {
            select: {
              id: true,
              title: true,
              passingScore: true,
            },
          },
          _count: {
            select: {
              answers: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.testSubmission.count({ where }),
    ])

    return NextResponse.json({
      submissions,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
