import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/materials/[id]/download - Track material download
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { userId } = body

    // Get material to check if it's paid
    const material = await prisma.material.findUnique({
      where: { id: params.id },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    // TODO: If material is paid, check if user has purchased it
    if (!material.isFree) {
      // Check payment
      // if (!hasUserPurchased(userId, material.id)) {
      //   return NextResponse.json({ error: 'Payment required' }, { status: 402 })
      // }
    }

    // Get client IP and user agent
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    const userAgent = req.headers.get('user-agent')

    // Create download record
    await prisma.materialDownload.create({
      data: {
        materialId: params.id,
        ...(userId && { userId }),
        ...(ip && { ipAddress: ip }),
        ...(userAgent && { userAgent }),
      },
    })

    // Increment download count
    await prisma.material.update({
      where: { id: params.id },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    })

    // Return download URL
    return NextResponse.json({
      success: true,
      downloadUrl: material.fileUrl,
      fileName: material.fileName,
    })
  } catch (error) {
    console.error('Error tracking download:', error)
    return NextResponse.json({ error: 'Failed to track download' }, { status: 500 })
  }
}
