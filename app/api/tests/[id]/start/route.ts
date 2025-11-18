import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/tests/[id]/start - Start a test (create submission)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { studentId } = body

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Check if test exists and is active
    const test = await prisma.test.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: {
            question: true,
          },
        },
        _count: {
          select: {
            submissions: {
              where: { studentId },
            },
          },
        },
      },
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    if (!test.isActive) {
      return NextResponse.json({ error: 'Test is not active' }, { status: 400 })
    }

    // Check if student has exceeded max attempts
    if (test.maxAttempts) {
      const previousAttempts = await prisma.testSubmission.count({
        where: {
          testId: params.id,
          studentId,
        },
      })

      if (previousAttempts >= test.maxAttempts) {
        return NextResponse.json(
          { error: 'Maximum attempts exceeded' },
          { status: 400 }
        )
      }
    }

    // Get the attempt number
    const attemptNumber = await prisma.testSubmission.count({
      where: {
        testId: params.id,
        studentId,
      },
    }) + 1

    // Get client IP and user agent
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    const userAgent = req.headers.get('user-agent')

    // Calculate total possible points
    const pointsPossible = test.questions.reduce((sum, tq) => {
      return sum + (tq.pointOverride || tq.question.points)
    }, 0)

    // Create submission
    const submission = await prisma.testSubmission.create({
      data: {
        testId: params.id,
        studentId,
        attemptNumber,
        pointsPossible,
        ...(ip && { ipAddress: ip }),
        ...(userAgent && { userAgent }),
      },
      include: {
        test: {
          include: {
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
              orderBy: test.shuffleQuestions
                ? { order: 'asc' } // TODO: Implement shuffling
                : { order: 'asc' },
            },
          },
        },
      },
    })

    // Remove correct answers if test doesn't allow showing them
    if (!test.showCorrectAnswers) {
      submission.test.questions = submission.test.questions.map(tq => ({
        ...tq,
        question: {
          ...tq.question,
          correctAnswer: null,
          explanation: null,
          options: tq.question.options.map(opt => ({
            ...opt,
            isCorrect: undefined,
          })) as any,
        },
      }))
    }

    return NextResponse.json(submission, { status: 201 })
  } catch (error: any) {
    console.error('Error starting test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to start test' },
      { status: 500 }
    )
  }
}
