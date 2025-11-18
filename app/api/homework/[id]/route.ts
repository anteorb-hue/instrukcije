import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/homework/[id] - Get single homework question
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const question = await prisma.homeworkQuestion.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            studentProfile: {
              select: {
                educationLevel: true,
              },
            },
          },
        },
        subject: true,
        assignedTutor: {
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
        acceptedAnswer: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        answers: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              },
            },
            _count: {
              select: {
                votes: true,
              },
            },
          },
          orderBy: [
            { isHelpful: 'desc' },
            { voteCount: 'desc' },
            { createdAt: 'asc' },
          ],
        },
        _count: {
          select: {
            answers: true,
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Homework question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(question)
  } catch (error: any) {
    console.error('Error fetching homework question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch homework question' },
      { status: 500 }
    )
  }
}

// PUT /api/homework/[id] - Update homework question
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      attachments,
      subjectId,
      educationLevel,
      tags,
      status,
      assignedTutorId,
    } = body

    const question = await prisma.homeworkQuestion.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(attachments !== undefined && { attachments }),
        ...(subjectId !== undefined && { subjectId }),
        ...(educationLevel !== undefined && { educationLevel }),
        ...(tags !== undefined && { tags }),
        ...(status && { status }),
        ...(assignedTutorId !== undefined && { assignedTutorId }),
      },
      include: {
        student: {
          select: { id: true, name: true, avatar: true },
        },
        subject: true,
        assignedTutor: {
          select: { id: true, name: true, avatar: true },
        },
      },
    })

    return NextResponse.json(question)
  } catch (error: any) {
    console.error('Error updating homework question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update homework question' },
      { status: 500 }
    )
  }
}

// DELETE /api/homework/[id] - Delete homework question
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const question = await prisma.homeworkQuestion.findUnique({
      where: { id: params.id },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Homework question not found' },
        { status: 404 }
      )
    }

    await prisma.homeworkQuestion.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting homework question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete homework question' },
      { status: 500 }
    )
  }
}
