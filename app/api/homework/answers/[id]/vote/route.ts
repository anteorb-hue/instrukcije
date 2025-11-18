import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/homework/answers/[id]/vote - Vote on answer (upvote/downvote)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { userId, vote } = body
    // vote: 1 for upvote, -1 for downvote

    if (!userId || (vote !== 1 && vote !== -1)) {
      return NextResponse.json(
        { error: 'User ID and vote (1 or -1) are required' },
        { status: 400 }
      )
    }

    // Check if answer exists
    const answer = await prisma.homeworkAnswer.findUnique({
      where: { id: params.id },
    })

    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 })
    }

    // Check if user already voted
    const existingVote = await prisma.answerVote.findUnique({
      where: {
        answerId_userId: {
          answerId: params.id,
          userId,
        },
      },
    })

    if (existingVote) {
      // If same vote, remove it (toggle)
      if (existingVote.vote === vote) {
        await prisma.$transaction([
          prisma.answerVote.delete({
            where: { id: existingVote.id },
          }),
          prisma.homeworkAnswer.update({
            where: { id: params.id },
            data: {
              voteCount: { decrement: vote },
            },
          }),
        ])

        return NextResponse.json({ action: 'removed', vote: null })
      } else {
        // If different vote, update it
        await prisma.$transaction([
          prisma.answerVote.update({
            where: { id: existingVote.id },
            data: { vote },
          }),
          prisma.homeworkAnswer.update({
            where: { id: params.id },
            data: {
              voteCount: { increment: vote * 2 }, // Change from -1 to +1 is +2, or +1 to -1 is -2
            },
          }),
        ])

        return NextResponse.json({ action: 'updated', vote })
      }
    } else {
      // Create new vote
      await prisma.$transaction([
        prisma.answerVote.create({
          data: {
            answerId: params.id,
            userId,
            vote,
          },
        }),
        prisma.homeworkAnswer.update({
          where: { id: params.id },
          data: {
            voteCount: { increment: vote },
          },
        }),
      ])

      return NextResponse.json({ action: 'created', vote })
    }
  } catch (error: any) {
    console.error('Error voting on answer:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to vote on answer' },
      { status: 500 }
    )
  }
}

// DELETE /api/homework/answers/[id]/vote - Remove vote
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const existingVote = await prisma.answerVote.findUnique({
      where: {
        answerId_userId: {
          answerId: params.id,
          userId,
        },
      },
    })

    if (!existingVote) {
      return NextResponse.json({ error: 'Vote not found' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.answerVote.delete({
        where: { id: existingVote.id },
      }),
      prisma.homeworkAnswer.update({
        where: { id: params.id },
        data: {
          voteCount: { decrement: existingVote.vote },
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error removing vote:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove vote' },
      { status: 500 }
    )
  }
}
