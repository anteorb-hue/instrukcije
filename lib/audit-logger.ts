/**
 * Audit Logging System
 *
 * Tracks important admin actions for security and compliance
 *
 * To persist audit logs to database, add this model to prisma/schema.prisma:
 *
 * model AuditLog {
 *   id          String   @id @default(cuid())
 *   userId      String
 *   userEmail   String
 *   action      String   // e.g., "USER_UPDATED", "USER_DELETED"
 *   resource    String   // e.g., "User", "Material", "Test"
 *   resourceId  String?  // ID of the affected resource
 *   details     Json?    // Additional context
 *   ipAddress   String?
 *   userAgent   String?
 *   createdAt   DateTime @default(now())
 *
 *   user User @relation(fields: [userId], references: [id], onDelete: Cascade)
 *
 *   @@index([userId])
 *   @@index([action])
 *   @@index([resource])
 *   @@index([createdAt])
 * }
 *
 * And add to User model:
 * auditLogs AuditLog[]
 */

import { NextRequest } from 'next/server'
import { captureMessage } from './sentry'

export type AuditAction =
  // User management
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'USER_ROLE_CHANGED'
  | 'USER_VERIFIED'
  | 'USER_BANNED'
  | 'USER_UNBANNED'
  // Content management
  | 'MATERIAL_CREATED'
  | 'MATERIAL_UPDATED'
  | 'MATERIAL_DELETED'
  | 'TEST_CREATED'
  | 'TEST_UPDATED'
  | 'TEST_DELETED'
  // Booking management
  | 'BOOKING_CANCELLED_BY_ADMIN'
  | 'BOOKING_UPDATED'
  // Payment management
  | 'PAYMENT_REFUNDED'
  | 'PAYMENT_UPDATED'
  // Reward management
  | 'REWARD_CREATED'
  | 'REWARD_UPDATED'
  | 'REWARD_DELETED'
  // System
  | 'SETTINGS_UPDATED'
  | 'BULK_OPERATION'
  | 'DATA_EXPORT'
  | 'DATA_IMPORT'

export type AuditResource =
  | 'User'
  | 'TutorProfile'
  | 'Material'
  | 'Test'
  | 'Booking'
  | 'Payment'
  | 'Reward'
  | 'Settings'
  | 'System'

export interface AuditLogEntry {
  userId: string
  userEmail: string
  action: AuditAction
  resource: AuditResource
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

// In-memory storage for audit logs (last 500 entries)
// In production, these should be persisted to database or external service
const auditLogs: AuditLogEntry[] = []
const MAX_AUDIT_LOGS = 500

/**
 * Log an audit entry
 */
export async function logAudit(entry: Omit<AuditLogEntry, 'timestamp'>) {
  const fullEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date(),
  }

  // Add to in-memory storage
  auditLogs.push(fullEntry)

  // Keep only last MAX_AUDIT_LOGS entries
  if (auditLogs.length > MAX_AUDIT_LOGS) {
    auditLogs.shift()
  }

  // Log to console
  const logMessage = `[AUDIT] ${entry.action} on ${entry.resource}${entry.resourceId ? ` (${entry.resourceId})` : ''} by ${entry.userEmail} (${entry.userId})`
  console.log(logMessage, entry.details || '')

  // Send important actions to Sentry for alerting
  const criticalActions: AuditAction[] = [
    'USER_DELETED',
    'USER_BANNED',
    'BULK_OPERATION',
    'DATA_EXPORT',
    'PAYMENT_REFUNDED',
  ]

  if (criticalActions.includes(entry.action)) {
    captureMessage(logMessage, 'warning', {
      audit: true,
      ...entry,
    })
  }

  // TODO: Persist to database when AuditLog model is added
  // await prisma.auditLog.create({ data: fullEntry })
}

/**
 * Extract IP address from request
 */
export function getIpAddress(req: NextRequest): string | undefined {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    undefined
  )
}

/**
 * Extract User Agent from request
 */
export function getUserAgent(req: NextRequest): string | undefined {
  return req.headers.get('user-agent') || undefined
}

/**
 * Middleware wrapper for audit logging
 */
export function withAuditLog(
  action: AuditAction,
  resource: AuditResource,
  getResourceId?: (req: NextRequest, context?: any) => string | undefined
) {
  return function <T extends (req: NextRequest, session: any, context?: any) => Promise<any>>(
    handler: T
  ): T {
    return (async (req: NextRequest, session: any, context?: any) => {
      const response = await handler(req, session, context)

      // Log the audit entry after successful operation
      if (response.status < 400) {
        await logAudit({
          userId: session.user.id,
          userEmail: session.user.email,
          action,
          resource,
          resourceId: getResourceId?.(req, context),
          ipAddress: getIpAddress(req),
          userAgent: getUserAgent(req),
        })
      }

      return response
    }) as T
  }
}

/**
 * Get audit logs (for admin viewing)
 */
export function getAuditLogs(filters?: {
  userId?: string
  action?: AuditAction
  resource?: AuditResource
  limit?: number
  offset?: number
}): AuditLogEntry[] {
  let filtered = [...auditLogs]

  if (filters?.userId) {
    filtered = filtered.filter(log => log.userId === filters.userId)
  }

  if (filters?.action) {
    filtered = filtered.filter(log => log.action === filters.action)
  }

  if (filters?.resource) {
    filtered = filtered.filter(log => log.resource === filters.resource)
  }

  // Sort by timestamp descending
  filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  // Apply pagination
  const offset = filters?.offset || 0
  const limit = filters?.limit || 50

  return filtered.slice(offset, offset + limit)
}

/**
 * Get audit log statistics
 */
export function getAuditStats(): {
  totalLogs: number
  byAction: Record<string, number>
  byResource: Record<string, number>
  recentActivity: AuditLogEntry[]
} {
  const byAction: Record<string, number> = {}
  const byResource: Record<string, number> = {}

  auditLogs.forEach(log => {
    byAction[log.action] = (byAction[log.action] || 0) + 1
    byResource[log.resource] = (byResource[log.resource] || 0) + 1
  })

  return {
    totalLogs: auditLogs.length,
    byAction,
    byResource,
    recentActivity: getAuditLogs({ limit: 10 }),
  }
}

/**
 * Helper functions for common audit actions
 */
export const auditHelpers = {
  userCreated: (userId: string, userEmail: string, by: { id: string; email: string }) =>
    logAudit({
      userId: by.id,
      userEmail: by.email,
      action: 'USER_CREATED',
      resource: 'User',
      resourceId: userId,
      details: { createdUser: userEmail },
    }),

  userUpdated: (
    userId: string,
    by: { id: string; email: string },
    changes: Record<string, any>
  ) =>
    logAudit({
      userId: by.id,
      userEmail: by.email,
      action: 'USER_UPDATED',
      resource: 'User',
      resourceId: userId,
      details: { changes },
    }),

  userDeleted: (userId: string, userEmail: string, by: { id: string; email: string }) =>
    logAudit({
      userId: by.id,
      userEmail: by.email,
      action: 'USER_DELETED',
      resource: 'User',
      resourceId: userId,
      details: { deletedUser: userEmail },
    }),

  userRoleChanged: (
    userId: string,
    oldRole: string,
    newRole: string,
    by: { id: string; email: string }
  ) =>
    logAudit({
      userId: by.id,
      userEmail: by.email,
      action: 'USER_ROLE_CHANGED',
      resource: 'User',
      resourceId: userId,
      details: { oldRole, newRole },
    }),

  bulkOperation: (
    operation: string,
    count: number,
    by: { id: string; email: string },
    details?: Record<string, any>
  ) =>
    logAudit({
      userId: by.id,
      userEmail: by.email,
      action: 'BULK_OPERATION',
      resource: 'System',
      details: { operation, count, ...details },
    }),

  dataExport: (
    resource: AuditResource,
    count: number,
    by: { id: string; email: string },
    filters?: Record<string, any>
  ) =>
    logAudit({
      userId: by.id,
      userEmail: by.email,
      action: 'DATA_EXPORT',
      resource,
      details: { count, filters },
    }),
}
