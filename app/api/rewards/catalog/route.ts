import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAvailableRewards } from '@/lib/rewards'

/**
 * GET /api/rewards/catalog
 * Get available rewards catalog
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const catalog = await getAvailableRewards(session.user.id)

    return NextResponse.json(catalog)
  } catch (error) {
    console.error('Error fetching rewards catalog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rewards catalog' },
      { status: 500 }
    )
  }
}
