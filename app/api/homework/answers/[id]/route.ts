import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/homework/answers/[id] - Get single answer
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const answer = await prisma.homeworkAnswer.findUnique({
      where: { id: params.id },
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
        question: {
          select: {
            id: true,
            title: true,
            studentId: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    })

    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 })
    }

    return NextResponse.json(answer)
  } catch (error: any) {
    console.error('Error fetching answer:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch answer' },
      { status: 500 }
    )
  }
}

// PUT /api/homework/answers/[id] - Update answer
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { content, attachments } = body

    const answer = await prisma.homeworkAnswer.update({
      where: { id: params.id },
      data: {
        ...(content && { content }),
        ...(attachments !== undefined && { attachments }),
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
      },
    })

    return NextResponse.json(answer)
  } catch (error: any) {
    console.error('Error updating answer:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update answer' },
      { status: 500 }
    )
  }
}

// DELETE /api/homework/answers/[id] - Delete answer
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const answer = await prisma.homeworkAnswer.findUnique({
      where: { id: params.id },
      include: {
        question: {
          select: {
            acceptedAnswerId: true,
          },
        },
      },
    })

    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 })
    }

    // If this is the accepted answer, remove it from question
    if (answer.question.acceptedAnswerId === params.id) {
      await prisma.homeworkQuestion.update({
        where: { id: answer.questionId },
        data: {
          acceptedAnswerId: null,
          status: 'OPEN',
        },
      })
    }

    await prisma.homeworkAnswer.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting answer:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete answer' },
      { status: 500 }
    )
  }
}
