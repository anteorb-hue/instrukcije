import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/submissions/[id] - Get single submission with answers
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const submission = await prisma.testSubmission.findUnique({
      where: { id: params.id },
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
          include: {
            tutor: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            subject: true,
            questions: {
              include: {
                question: {
                  include: {
                    options: {
                      orderBy: { order: 'asc' },
                    },
                  },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
        answers: true,
      },
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json(submission)
  } catch (error: any) {
    console.error('Error fetching submission:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}
