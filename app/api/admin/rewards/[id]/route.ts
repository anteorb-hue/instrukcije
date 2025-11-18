import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/rewards/[id] - Get single reward (Admin only)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const reward = await prisma.rewardCatalog.findUnique({
      where: { id: params.id },
    })

    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
    }

    return NextResponse.json(reward)
  } catch (error: any) {
    console.error('Error fetching reward:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reward' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/rewards/[id] - Update reward (Admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const {
      type,
      title,
      description,
      pointsCost,
      value,
      userRole,
      active,
      limitPerUser,
      validDays,
      icon,
      imageUrl,
      metadata,
    } = body

    const reward = await prisma.rewardCatalog.update({
      where: { id: params.id },
      data: {
        ...(type && { type }),
        ...(title && { title }),
        ...(description && { description }),
        ...(pointsCost !== undefined && { pointsCost }),
        ...(value !== undefined && { value }),
        ...(userRole !== undefined && { userRole }),
        ...(active !== undefined && { active }),
        ...(limitPerUser !== undefined && { limitPerUser }),
        ...(validDays !== undefined && { validDays }),
        ...(icon !== undefined && { icon }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(metadata !== undefined && { metadata }),
      },
    })

    return NextResponse.json(reward)
  } catch (error: any) {
    console.error('Error updating reward:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update reward' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/rewards/[id] - Delete reward (Admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.rewardCatalog.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting reward:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete reward' },
      { status: 500 }
    )
  }
}
