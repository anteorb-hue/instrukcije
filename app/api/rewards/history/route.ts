import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/rewards/history
 * Get user's point transaction history
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type') // Filter by transaction type

    const userPoints = await prisma.userPoints.findUnique({
      where: { userId: session.user.id },
    })

    if (!userPoints) {
      return NextResponse.json({
        transactions: [],
        total: 0,
        hasMore: false,
      })
    }

    const where: { userPointsId: string; type?: string } = { userPointsId: userPoints.id }
    if (type) {
      where.type = type
    }

    const [transactions, total] = await Promise.all([
      prisma.pointTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.pointTransaction.count({ where }),
    ])

    return NextResponse.json({
      transactions,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Error fetching transaction history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaction history' },
      { status: 500 }
    )
  }
}
