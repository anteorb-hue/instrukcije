import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/admin/rewards
 * Get all rewards in catalog (admin only)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const rewards = await prisma.rewardCatalog.findMany({
      orderBy: [{ userRole: 'asc' }, { pointsCost: 'asc' }],
    })

    return NextResponse.json(rewards)
  } catch (error) {
    console.error('Error fetching rewards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rewards' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/rewards
 * Create new reward in catalog (admin only)
 */
export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!type || !title || !description || pointsCost === undefined || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const reward = await prisma.rewardCatalog.create({
      data: {
        type,
        title,
        description,
        pointsCost,
        value,
        userRole: userRole || null,
        active: active !== undefined ? active : true,
        limitPerUser,
        validDays,
        icon,
        imageUrl,
      },
    })

    return NextResponse.json(reward, { status: 201 })
  } catch (error) {
    console.error('Error creating reward:', error)
    return NextResponse.json(
      { error: 'Failed to create reward' },
      { status: 500 }
    )
  }
}
