import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tests - List all tests
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tutorId = searchParams.get('tutorId')
    const subjectId = searchParams.get('subjectId')
    const educationLevel = searchParams.get('educationLevel')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const isPublic = searchParams.get('isPublic')
    const isActive = searchParams.get('isActive')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      ...(tutorId && { tutorId }),
      ...(subjectId && { subjectId }),
      ...(educationLevel && { educationLevel: educationLevel as any }),
      ...(difficulty && { difficulty: difficulty as any }),
      ...(isPublic !== null && isPublic !== undefined && { isPublic: isPublic === 'true' }),
      ...(isActive !== null && isActive !== undefined && { isActive: isActive === 'true' }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [tests, total] = await Promise.all([
      prisma.test.findMany({
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
          _count: {
            select: {
              questions: true,
              submissions: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.test.count({ where }),
    ])

    return NextResponse.json({
      tests,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}

// POST /api/tests - Create new test
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      tutorId,
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

    if (!tutorId || !title) {
      return NextResponse.json(
        { error: 'Tutor ID and title are required' },
        { status: 400 }
      )
    }

    // Create test with questions
    const test = await prisma.test.create({
      data: {
        tutorId,
        title,
        description,
        instructions,
        subjectId,
        educationLevel,
        difficulty: difficulty || 'MEDIUM',
        timeLimit,
        passingScore: passingScore || 60,
        shuffleQuestions: shuffleQuestions ?? false,
        showCorrectAnswers: showCorrectAnswers ?? true,
        allowRetake: allowRetake ?? true,
        maxAttempts,
        isPublic: isPublic ?? false,
        isActive: isActive ?? true,
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
        _count: {
          select: { questions: true },
        },
      },
    })

    return NextResponse.json(test, { status: 201 })
  } catch (error: any) {
    console.error('Error creating test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create test' },
      { status: 500 }
    )
  }
}
