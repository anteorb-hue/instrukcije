import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserPointsSummary } from '@/lib/rewards'

/**
 * GET /api/rewards/points
 * Get current user's points summary
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const summary = await getUserPointsSummary(session.user.id)

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching points:', error)
    return NextResponse.json(
      { error: 'Failed to fetch points' },
      { status: 500 }
    )
  }
}
