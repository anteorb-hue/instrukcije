import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

// GET /api/homework/[id]/answers - List answers for a homework question
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const [answers, total] = await Promise.all([
      prisma.homeworkAnswer.findMany({
        where: { questionId: params.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
              tutorProfile: {
                select: {
                  title: true,
                  verified: true,
                },
              },
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: [
          { isHelpful: 'desc' },
          { voteCount: 'desc' },
          { createdAt: 'asc' },
        ],
      }),
      prisma.homeworkAnswer.count({ where: { questionId: params.id } }),
    ])

    return NextResponse.json({
      answers,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Error fetching answers:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch answers' },
      { status: 500 }
    )
  }
}

// POST /api/homework/[id]/answers - Create new answer
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { authorId, content, attachments } = body

    if (!authorId || !content) {
      return NextResponse.json(
        { error: 'Author ID and content are required' },
        { status: 400 }
      )
    }

    // Check if question exists
    const question = await prisma.homeworkQuestion.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Homework question not found' },
        { status: 404 }
      )
    }

    const answer = await prisma.homeworkAnswer.create({
      data: {
        questionId: params.id,
        authorId,
        content,
        attachments: attachments || [],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        question: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Send notification to question author (student)
    if (authorId !== question.studentId) {
      try {
        await prisma.notification.create({
          data: {
            userId: question.studentId,
            type: 'homework_answer_received',
            title: 'Novi odgovor na pitanje',
            message: `${answer.author.name} je odgovorio/la na vaše pitanje: "${question.title}"`,
            data: JSON.stringify({ questionId: question.id, answerId: answer.id }),
          },
        })

        // Send email notification
        await sendEmail({
          to: question.student.email,
          subject: `Novi odgovor - ${question.title}`,
          html: `
            <h2>Pozdrav ${question.student.name},</h2>
            <p>${answer.author.name} je odgovorio/la na vaše pitanje:</p>
            <h3>${question.title}</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${answer.content}
            </div>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/homework/${question.id}">Pogledaj odgovor</a></p>
          `,
        })
      } catch (emailError) {
        console.error('Error sending notification:', emailError)
      }
    }

    return NextResponse.json(answer, { status: 201 })
  } catch (error: any) {
    console.error('Error creating answer:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create answer' },
      { status: 500 }
    )
  }
}
