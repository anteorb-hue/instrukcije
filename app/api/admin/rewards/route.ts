import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/rewards - List all rewards in catalog (Admin only)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const userRole = searchParams.get('userRole')
    const active = searchParams.get('active')

    const where: any = {
      ...(type && { type: type as any }),
      ...(userRole && { userRole: userRole as any }),
      ...(active !== null && active !== undefined && { active: active === 'true' }),
    }

    const rewards = await prisma.rewardCatalog.findMany({
      where,
      orderBy: {
        pointsCost: 'asc',
      },
    })

    return NextResponse.json({ rewards })
  } catch (error: any) {
    console.error('Error fetching rewards:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch rewards' },
      { status: 500 }
    )
  }
}

// POST /api/admin/rewards - Create new reward (Admin only)
export async function POST(req: Request) {
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

    if (!type || !title || !description || !pointsCost || !value) {
      return NextResponse.json(
        { error: 'Type, title, description, pointsCost, and value are required' },
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
        userRole,
        active: active ?? true,
        limitPerUser,
        validDays,
        icon,
        imageUrl,
        metadata,
      },
    })

    return NextResponse.json(reward, { status: 201 })
  } catch (error: any) {
    console.error('Error creating reward:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create reward' },
      { status: 500 }
    )
  }
}
