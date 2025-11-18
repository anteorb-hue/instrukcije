import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/materials/[id]/view - Track material view
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { userId } = body

    // Get client IP and user agent
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    const userAgent = req.headers.get('user-agent')

    // Create view record
    await prisma.materialView.create({
      data: {
        materialId: params.id,
        ...(userId && { userId }),
        ...(ip && { ipAddress: ip }),
        ...(userAgent && { userAgent }),
      },
    })

    // Increment view count
    await prisma.material.update({
      where: { id: params.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}
