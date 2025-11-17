import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { rewardReferral } from '@/lib/rewards'
import { prisma } from '@/lib/db'

/**
 * POST /api/rewards/referral
 * Process referral signup and award points
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { referralCode } = body

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      )
    }

    // Find referrer by code
    const referrerPoints = await prisma.userPoints.findUnique({
      where: { referralCode },
      include: { user: true },
    })

    if (!referrerPoints) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      )
    }

    // Check if user already has referrer set
    const newUserPoints = await prisma.userPoints.findUnique({
      where: { userId: session.user.id },
    })

    if (newUserPoints?.referredBy) {
      return NextResponse.json(
        { error: 'You have already used a referral code' },
        { status: 400 }
      )
    }

    // Cannot refer yourself
    if (referrerPoints.userId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot refer yourself' },
        { status: 400 }
      )
    }

    const result = await rewardReferral(referrerPoints.userId, session.user.id)

    return NextResponse.json({
      success: true,
      result,
      message: 'Referral uspješno apliciran!',
    })
  } catch (error: any) {
    console.error('Error processing referral:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process referral' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/rewards/referral
 * Get user's referral statistics
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userPoints = await prisma.userPoints.findUnique({
      where: { userId: session.user.id },
      select: {
        referralCode: true,
        totalReferrals: true,
        referredBy: true,
      },
    })

    if (!userPoints) {
      return NextResponse.json({
        referralCode: null,
        totalReferrals: 0,
        referredBy: null,
      })
    }

    // Get referred users
    const referredUsers = await prisma.userPoints.findMany({
      where: { referredBy: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    })

    return NextResponse.json({
      referralCode: userPoints.referralCode,
      totalReferrals: userPoints.totalReferrals,
      referredBy: userPoints.referredBy,
      referredUsers: referredUsers.map((r) => ({
        name: r.user.name,
        email: r.user.email,
        role: r.user.role,
        joinedAt: r.user.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching referral stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral statistics' },
      { status: 500 }
    )
  }
}
