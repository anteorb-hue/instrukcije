import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/questions/[id] - Get single question
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const question = await prisma.question.findUnique({
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
        options: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            testsUsedIn: true,
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    return NextResponse.json(question)
  } catch (error: any) {
    console.error('Error fetching question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch question' },
      { status: 500 }
    )
  }
}

// PUT /api/questions/[id] - Update question
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const {
      questionText,
      type,
      points,
      options, // Array of { optionText, isCorrect, order }
      correctAnswer,
      explanation,
      subjectId,
      educationLevel,
      difficulty,
      tags,
    } = body

    // If options are provided, delete existing and create new
    if (options) {
      await prisma.questionOption.deleteMany({
        where: { questionId: params.id },
      })
    }

    const question = await prisma.question.update({
      where: { id: params.id },
      data: {
        ...(questionText && { questionText }),
        ...(type && { type }),
        ...(points !== undefined && { points }),
        ...(correctAnswer !== undefined && { correctAnswer }),
        ...(explanation !== undefined && { explanation }),
        ...(subjectId !== undefined && { subjectId }),
        ...(educationLevel !== undefined && { educationLevel }),
        ...(difficulty && { difficulty }),
        ...(tags !== undefined && { tags }),
        ...(options &&
          options.length > 0 && {
            options: {
              createMany: {
                data: options.map((opt: any, index: number) => ({
                  optionText: opt.optionText,
                  isCorrect: opt.isCorrect || false,
                  order: opt.order !== undefined ? opt.order : index,
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
        options: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(question)
  } catch (error: any) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update question' },
      { status: 500 }
    )
  }
}

// DELETE /api/questions/[id] - Delete question
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            testsUsedIn: true,
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Optional: Prevent deletion if question is used in tests
    // if (question._count.testsUsedIn > 0) {
    //   return NextResponse.json(
    //     { error: 'Cannot delete question that is used in tests' },
    //     { status: 400 }
    //   )
    // }

    await prisma.question.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete question' },
      { status: 500 }
    )
  }
}
