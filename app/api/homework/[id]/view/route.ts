import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/homework/[id]/view - Track view
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
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
