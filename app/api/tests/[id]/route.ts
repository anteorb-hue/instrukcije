import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    // Check if test exists
    const test = await prisma.test.findUnique({
      where: { id: params.id },
      include: {
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

    // Optional: Prevent deletion if there are submissions
    // if (test._count.submissions > 0) {
    //   return NextResponse.json(
    //     { error: 'Cannot delete test with existing submissions' },
    //     { status: 400 }
    //   )
    // }

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
