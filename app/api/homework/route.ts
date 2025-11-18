import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { homeworkQuestionListingSelect, getPagination } from '@/lib/query-optimization'

// GET /api/homework - List all homework questions
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    const subjectId = searchParams.get('subjectId')
    const educationLevel = searchParams.get('educationLevel')
    const status = searchParams.get('status')
    const assignedTutorId = searchParams.get('assignedTutorId')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { skip, take } = offset > 0 ? { skip: offset, take: limit } : getPagination(page, limit)

    const where: any = {
      ...(studentId && { studentId }),
      ...(subjectId && { subjectId }),
      ...(educationLevel && { educationLevel: educationLevel as any }),
      ...(status && { status: status as any }),
      ...(assignedTutorId && { assignedTutorId }),
      ...(tag && { tags: { has: tag } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [questions, total] = await Promise.all([
      prisma.homeworkQuestion.findMany({
        where,
        select: homeworkQuestionListingSelect,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.homeworkQuestion.count({ where }),
    ])

    return NextResponse.json({
      questions,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Error fetching homework questions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch homework questions' },
      { status: 500 }
    )
  }
}

// POST /api/homework - Create new homework question
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      studentId,
      title,
      description,
      attachments,
      subjectId,
      educationLevel,
      tags,
      assignedTutorId,
    } = body

    if (!studentId || !title || !description) {
      return NextResponse.json(
        { error: 'Student ID, title, and description are required' },
        { status: 400 }
      )
    }

    const question = await prisma.homeworkQuestion.create({
      data: {
        studentId,
        title,
        description,
        attachments: attachments || [],
        subjectId,
        educationLevel,
        tags: tags || [],
        assignedTutorId,
      },
      select: {
        ...homeworkQuestionListingSelect,
        description: true,
        attachments: true,
        tags: true,
        educationLevel: true,
        createdAt: true,
        updatedAt: true,
        assignedTutor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
      },
    })

    // Send notification to assigned tutor
    if (assignedTutorId && question.assignedTutor) {
      try {
        await prisma.notification.create({
          data: {
            userId: assignedTutorId,
            type: 'homework_question_assigned',
            title: 'Nova domaća zadaća',
            message: `${question.student.name} vam je dodijelio/la pitanje: "${question.title}"`,
            data: JSON.stringify({ questionId: question.id }),
          },
        })

        // Send email notification
        await sendEmail({
          to: question.assignedTutor.email,
          subject: `Nova domaća zadaća - ${question.title}`,
          html: `
            <h2>Pozdrav ${question.assignedTutor.name},</h2>
            <p>${question.student.name} vam je dodijelio/la novo pitanje:</p>
            <h3>${question.title}</h3>
            <p>${question.description}</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/homework/${question.id}">Odgovori na pitanje</a></p>
          `,
        })
      } catch (emailError) {
        console.error('Error sending notification:', emailError)
      }
    }

    return NextResponse.json(question, { status: 201 })
  } catch (error: any) {
    console.error('Error creating homework question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create homework question' },
      { status: 500 }
    )
  }
}
