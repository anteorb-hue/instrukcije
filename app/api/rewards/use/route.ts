import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { applyReward } from '@/lib/rewards'

/**
 * POST /api/rewards/use
 * Mark a redeemed reward as used
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rewardId, bookingId } = body

    if (!rewardId) {
      return NextResponse.json(
        { error: 'Reward ID is required' },
        { status: 400 }
      )
    }

    const reward = await applyReward(rewardId, session.user.id, bookingId)

    return NextResponse.json({
      success: true,
      reward,
      message: 'Nagrada je uspješno iskorištena!',
    })
  } catch (error: unknown) {
    console.error('Error using reward:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage === 'Reward not found or already used') {
      return NextResponse.json(
        { error: 'Nagrada nije pronađena ili je već iskorištena' },
        { status: 404 }
      )
    }

    if (errorMessage === 'Reward has expired') {
      return NextResponse.json(
        { error: 'Nagrada je istekla' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to use reward' },
      { status: 500 }
    )
  }
}
