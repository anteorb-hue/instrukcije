import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/tests/[id] - Get single test with questions
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const test = await prisma.test.findUnique({
      where: { id: params.id },
      include: {
        tutor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            tutorProfile: {
              select: {
                title: true,
                verified: true,
              },
            },
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
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    return NextResponse.json(test)
  } catch (error: any) {
    console.error('Error fetching test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch test' },
      { status: 500 }
    )
  }
}

// PUT /api/tests/[id] - Update test
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Require authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Check ownership
    const existingTest = await prisma.test.findUnique({
      where: { id: params.id },
      select: { tutorId: true },
    })

    if (!existingTest) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Only the tutor who created it or admin can update
    if (existingTest.tutorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - You can only update your own tests' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      instructions,
      subjectId,
      educationLevel,
      difficulty,
      timeLimit,
      passingScore,
      shuffleQuestions,
      showCorrectAnswers,
      allowRetake,
      maxAttempts,
      isPublic,
      isActive,
      questions, // Array of { questionId, order, pointOverride }
    } = body

    // If questions are provided, delete existing and create new
    if (questions) {
      await prisma.testQuestion.deleteMany({
        where: { testId: params.id },
      })
    }

    const test = await prisma.test.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(instructions !== undefined && { instructions }),
        ...(subjectId !== undefined && { subjectId }),
        ...(educationLevel !== undefined && { educationLevel }),
        ...(difficulty && { difficulty }),
        ...(timeLimit !== undefined && { timeLimit }),
        ...(passingScore !== undefined && { passingScore }),
        ...(shuffleQuestions !== undefined && { shuffleQuestions }),
        ...(showCorrectAnswers !== undefined && { showCorrectAnswers }),
        ...(allowRetake !== undefined && { allowRetake }),
        ...(maxAttempts !== undefined && { maxAttempts }),
        ...(isPublic !== undefined && { isPublic }),
        ...(isActive !== undefined && { isActive }),
        ...(questions &&
          questions.length > 0 && {
            questions: {
              createMany: {
                data: questions.map((q: any) => ({
                  questionId: q.questionId,
                  order: q.order || 0,
                  pointOverride: q.pointOverride,
                })),
              },
            },
          }),
      },
      include: {
        tutor: {
          select: { id: true, name: true, avatar: true },
        },
        subject: true,
        questions: {
          include: {
            question: {
              include: {
                options: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(test)
  } catch (error: any) {
    console.error('Error updating test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update test' },
      { status: 500 }
    )
  }
}

// DELETE /api/tests/[id] - Delete test
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Require authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Check if test exists and get ownership info
    const test = await prisma.test.findUnique({
      where: { id: params.id },
      select: {
        tutorId: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Only the tutor who created it or admin can delete
    if (test.tutorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - You can only delete your own tests' },
        { status: 403 }
      )
    }

    // Prevent deletion if there are submissions (data integrity protection)
    if (test._count.submissions > 0) {
      return NextResponse.json(
        { error: 'Cannot delete test with existing submissions. Consider deactivating it instead.' },
        { status: 400 }
      )
    }

    await prisma.test.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete test' },
      { status: 500 }
    )
  }
}
