import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redeemReward } from '@/lib/rewards'
import { RewardType } from '@prisma/client'

/**
 * POST /api/rewards/redeem
 * Redeem points for a reward
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rewardType, title, pointsCost, value, validDays, description } = body

    // Validate required fields
    if (!rewardType || !title || !pointsCost || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate reward type
    const validRewardTypes: RewardType[] = [
      'DISCOUNT',
      'VOUCHER',
      'FEATURED',
      'FREE_LESSON',
      'PREMIUM',
      'COMMISSION_DISCOUNT',
    ]

    if (!validRewardTypes.includes(rewardType as RewardType)) {
      return NextResponse.json(
        { error: 'Invalid reward type' },
        { status: 400 }
      )
    }

    const reward = await redeemReward(
      session.user.id,
      rewardType as RewardType,
      title,
      pointsCost,
      value,
      { validDays, description }
    )

    return NextResponse.json({
      success: true,
      reward,
      message: `Uspješno ste iskoristili ${pointsCost} bodova!`,
    })
  } catch (error: any) {
    console.error('Error redeeming reward:', error)

    if (error.message === 'Insufficient points') {
      return NextResponse.json(
        { error: 'Nemate dovoljno bodova za ovu nagradu' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to redeem reward' },
      { status: 500 }
    )
  }
}
