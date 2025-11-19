import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/tests/[id]/start - Start a test (create submission)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Require authentication to prevent unauthorized test access
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to start test' },
        { status: 401 }
      )
    }

    // Use authenticated user ID from session (not from request body!)
    const studentId = session.user.id

    // Check if test exists and is active
    const test = await prisma.test.findUnique({
      where: { id: params.id },
      include: {
        tutor: {
          select: { id: true },
        },
        questions: {
          include: {
            question: true,
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

    // ACCESS CONTROL: Check if user has permission to access this test
    // Public tests are accessible to everyone
    // Private tests are only accessible to the tutor who created them or admins
    if (!test.isPublic) {
      const hasAccess =
        test.tutor.id === session.user.id ||
        session.user.role === 'ADMIN'

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Forbidden - This test is private' },
          { status: 403 }
        )
      }
    }

    // FIX RACE CONDITION: Use a single query to get attempt count
    // This prevents race condition between checking and creating submission
    const previousAttempts = await prisma.testSubmission.count({
      where: {
        testId: params.id,
        studentId,
      },
    })

    // Check if student has exceeded max attempts
    if (test.maxAttempts && previousAttempts >= test.maxAttempts) {
      return NextResponse.json(
        { error: `Maximum attempts exceeded (${test.maxAttempts} allowed)` },
        { status: 400 }
      )
    }

    const attemptNumber = previousAttempts + 1

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
