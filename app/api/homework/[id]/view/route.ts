import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/homework/[id]/view - Track view
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Require authentication to prevent bot spam
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Increment view count
    await prisma.homeworkQuestion.update({
      where: { id: params.id },
      data: {
        viewCount: { increment: 1 },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to track view' },
      { status: 500 }
    )
  }
}
