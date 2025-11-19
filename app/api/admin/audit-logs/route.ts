import { NextResponse, NextRequest } from 'next/server'
import { withAdmin } from '@/lib/auth-middleware'
import { getAuditLogs, getAuditStats, AuditAction, AuditResource } from '@/lib/audit-logger'

// GET /api/admin/audit-logs - Get audit logs (Admin only)
export const GET = withAdmin(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)

    const userId = searchParams.get('userId') || undefined
    const action = searchParams.get('action') as AuditAction | undefined
    const resource = searchParams.get('resource') as AuditResource | undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const logs = getAuditLogs({
      userId,
      action,
      resource,
      limit,
      offset,
    })

    const stats = getAuditStats()

    return NextResponse.json({
      logs,
      total: stats.totalLogs,
      stats,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
})
