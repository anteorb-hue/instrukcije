import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withTutor } from '@/lib/auth-middleware'

// GET /api/questions - List all questions (Question Bank)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tutorId = searchParams.get('tutorId')
    const subjectId = searchParams.get('subjectId')
    const educationLevel = searchParams.get('educationLevel')
    const difficulty = searchParams.get('difficulty')
    const type = searchParams.get('type')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      ...(tutorId && { tutorId }),
      ...(subjectId && { subjectId }),
      ...(educationLevel && { educationLevel: educationLevel as any }),
      ...(difficulty && { difficulty: difficulty as any }),
      ...(type && { type: type as any }),
      ...(tag && { tags: { has: tag } }),
      ...(search && {
        questionText: { contains: search, mode: 'insensitive' },
      }),
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          tutor: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          subject: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          options: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              testsUsedIn: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.question.count({ where }),
    ])

    return NextResponse.json({
      questions,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

// POST /api/questions - Create new question (Tutor only)
export const POST = withTutor(async (req: NextRequest, session) => {
  try {
    // Use authenticated tutor ID from session
    const tutorId = session.user.id

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

    if (!questionText || !type) {
      return NextResponse.json(
        { error: 'Question text and type are required' },
        { status: 400 }
      )
    }

    // Validate multiple choice questions have options
    if (type === 'MULTIPLE_CHOICE' && (!options || options.length === 0)) {
      return NextResponse.json(
        { error: 'Multiple choice questions must have options' },
        { status: 400 }
      )
    }

    // Validate TRUE_FALSE has correctAnswer
    if (type === 'TRUE_FALSE' && !correctAnswer) {
      return NextResponse.json(
        { error: 'True/False questions must have correctAnswer (true or false)' },
        { status: 400 }
      )
    }

    const question = await prisma.question.create({
      data: {
        tutorId,
        questionText,
        type,
        points: points || 1,
        correctAnswer,
        explanation,
        subjectId,
        educationLevel,
        difficulty: difficulty || 'MEDIUM',
        tags: tags || [],
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

    return NextResponse.json(question, { status: 201 })
  } catch (error: any) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create question' },
      { status: 500 }
    )
  }
})
