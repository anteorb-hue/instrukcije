import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * PUT /api/admin/rewards/[id]
 * Update reward in catalog (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
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
    } = body

    const reward = await prisma.rewardCatalog.update({
      where: { id: params.id },
      data: {
        ...(type && { type }),
        ...(title && { title }),
        ...(description && { description }),
        ...(pointsCost !== undefined && { pointsCost }),
        ...(value !== undefined && { value }),
        ...(userRole !== undefined && { userRole: userRole || null }),
        ...(active !== undefined && { active }),
        ...(limitPerUser !== undefined && { limitPerUser }),
        ...(validDays !== undefined && { validDays }),
        ...(icon !== undefined && { icon }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    })

    return NextResponse.json(reward)
  } catch (error: unknown) {
    console.error('Error updating reward:', error)

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to update reward' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/rewards/[id]
 * Delete reward from catalog (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.rewardCatalog.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Reward deleted successfully' })
  } catch (error: unknown) {
    console.error('Error deleting reward:', error)

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to delete reward' },
      { status: 500 }
    )
  }
}
