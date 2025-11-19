# Monitoring & Observability Guide

Ovaj dokument objašnjava monitoring i observability sistem implementiran u projektu.

## Pregled

Monitoring sistem sastoji se od tri glavna komponenta:
1. **Error Tracking** - Sentry integracija za hvatanje i praćenje grešaka
2. **Performance Monitoring** - Praćenje response times i slow queries
3. **Audit Logging** - Logiranje admin akcija za compliance i security

## 1. Error Tracking (Sentry)

### Setup

**Instalacija:**
```bash
npm install @sentry/nextjs
```

**Konfiguracija:**
Dodaj u `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

**Inicijalizacija:**
U `app/layout.tsx` ili `pages/_app.tsx`:
```typescript
import { initSentry } from '@/lib/sentry'

// Inicijaliziraj Sentry pri startu aplikacije
if (typeof window !== 'undefined') {
  initSentry()
}
```

### Korištenje

#### Capture Exception
```typescript
import { captureException } from '@/lib/sentry'

try {
  // Risky operation
  await someOperation()
} catch (error) {
  captureException(error as Error, {
    userId: user.id,
    operation: 'someOperation',
    context: 'additional info',
  })
  throw error
}
```

#### Capture Message
```typescript
import { captureMessage } from '@/lib/sentry'

captureMessage(
  'Important event occurred',
  'warning',
  { userId: '123', action: 'bulk_delete' }
)
```

#### Set User Context
```typescript
import { setUser, clearUser } from '@/lib/sentry'

// Pri loginu
setUser({
  id: user.id,
  email: user.email,
  username: user.name,
  role: user.role,
})

// Pri logountu
clearUser()
```

#### Error Boundary za React
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  )
}
```

#### Wrapper za API Routes
```typescript
import { withErrorTracking } from '@/lib/sentry'

export const GET = withErrorTracking(
  async (req: NextRequest) => {
    // Handler logic
  },
  'GET /api/users'
)
```

### Najbolje Prakse

1. **Ne šalji osjetljive podatke** - Filtriraj passwords, tokens, credit card info
2. **Dodaj kontekst** - Uvijek dodaj context sa korisnim informacijama
3. **Koristi breadcrumbs** - Za praćenje user flow-a prije greške
4. **Postavi user context** - Nakon login-a za bolji debugging

### Ignoriranje Grešaka

Sentry automatski ignoriše:
- Network errors
- Browser extension errors
- Cancelled requests
- Common third-party errors

## 2. Performance Monitoring

### Setup

Performance monitoring je već konfiguriran i ne zahtijeva dodatne pakete.

### Korištenje

#### Praćenje API Response Times

**Automatic Wrapper:**
```typescript
import { withPerformanceMonitoring } from '@/lib/performance-monitoring'

export const GET = withPerformanceMonitoring(
  async (req: NextRequest) => {
    // Handler logic
  },
  'GET /api/materials' // Optional custom name
)
```

Response će sadržavati `X-Response-Time` header.

**Manual Timing:**
```typescript
import { startTimer } from '@/lib/performance-monitoring'

const timer = startTimer('Fetch materials')

const materials = await fetchMaterials()

const duration = timer.endAndLog() // Logs: "⏱️  Fetch materials: 245ms"
```

#### Praćenje Database Queries

```typescript
import { trackDatabaseQuery } from '@/lib/performance-monitoring'

const users = await trackDatabaseQuery('Find active users', async () => {
  return await prisma.user.findMany({
    where: { isActive: true },
  })
})
```

Slow queries (>500ms) će biti automatski logovani.

#### Measure Async Functions

```typescript
import { measureAsync } from '@/lib/performance-monitoring'

const result = await measureAsync(
  'Process payment',
  async () => {
    return await processPayment(data)
  },
  { userId: user.id, amount: 100 }
)
```

#### Prisma Performance Middleware

U `lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import { createPrismaPerformanceMiddleware } from '@/lib/performance-monitoring'

const prisma = new PrismaClient()

// Dodaj performance tracking middleware
prisma.$use(createPrismaPerformanceMiddleware())

export { prisma }
```

### Performance Thresholds

```typescript
THRESHOLDS = {
  API_RESPONSE_SLOW: 1000ms      // Warning
  API_RESPONSE_CRITICAL: 3000ms  // Critical (sent to Sentry)
  DATABASE_QUERY_SLOW: 500ms     // Warning
  DATABASE_QUERY_CRITICAL: 2000ms // Critical
}
```

### Statistics

**Get Performance Stats:**
```typescript
import { getPerformanceStats, getCacheStats, logPerformanceSummary } from '@/lib/performance-monitoring'

// API stats
const apiStats = getPerformanceStats('API')
console.log(`Avg: ${apiStats.avg}ms, P95: ${apiStats.p95}ms`)

// Cache stats
const cacheStats = getCacheStats()
console.log(`Hit rate: ${cacheStats.hitRate}%`)

// Full summary (useful in development)
logPerformanceSummary()
```

**Output:**
```
📊 Performance Summary:

API:
  Count: 1250
  Avg: 245ms
  P50: 180ms
  P95: 650ms
  Max: 2100ms

Database:
  Count: 3420
  Avg: 85ms
  P50: 45ms
  P95: 320ms
  Max: 1850ms

Cache:
  Hits: 4532
  Misses: 1203
  Hit Rate: 79.02%
  Size: 245 entries
```

### Monitoring Dashboard Endpoint

Kreiraj admin endpoint za live monitoring:

```typescript
// app/api/admin/monitoring/route.ts
import { withAdmin } from '@/lib/auth-middleware'
import { getPerformanceStats, getCacheStats } from '@/lib/performance-monitoring'

export const GET = withAdmin(async () => {
  return NextResponse.json({
    api: getPerformanceStats('API'),
    database: getPerformanceStats('DB'),
    cache: getCacheStats(),
  })
})
```

## 3. Audit Logging

### Što se Logira

Audit logging prati kritične admin akcije:
- User management (create, update, delete, role changes)
- Content management (materials, tests)
- Payment operations (refunds)
- Bulk operations
- Data exports

### Korištenje

#### Helper Functions (Recommended)

```typescript
import { auditHelpers } from '@/lib/audit-logger'

// User updated
await auditHelpers.userUpdated(
  userId,
  session.user,
  { name: 'New Name', role: 'TUTOR' }
)

// User deleted
await auditHelpers.userDeleted(userId, userEmail, session.user)

// Role changed
await auditHelpers.userRoleChanged(
  userId,
  'STUDENT',
  'TUTOR',
  session.user
)

// Bulk operation
await auditHelpers.bulkOperation(
  'Bulk delete materials',
  25,
  session.user,
  { filter: 'type=VIDEO' }
)

// Data export
await auditHelpers.dataExport(
  'User',
  1500,
  session.user,
  { role: 'STUDENT', createdAfter: '2024-01-01' }
)
```

#### Manual Logging

```typescript
import { logAudit } from '@/lib/audit-logger'

await logAudit({
  userId: session.user.id,
  userEmail: session.user.email,
  action: 'REWARD_CREATED',
  resource: 'Reward',
  resourceId: reward.id,
  details: { title: reward.title, points: reward.pointsCost },
  ipAddress: getIpAddress(req),
  userAgent: getUserAgent(req),
})
```

### Viewing Audit Logs

**API Endpoint:**
```typescript
GET /api/admin/audit-logs
  ?userId=xxx          // Filter by user
  &action=USER_DELETED // Filter by action
  &resource=User       // Filter by resource
  &limit=50           // Pagination
  &offset=0           // Pagination
```

**Response:**
```json
{
  "logs": [
    {
      "userId": "clx123...",
      "userEmail": "admin@example.com",
      "action": "USER_DELETED",
      "resource": "User",
      "resourceId": "clx456...",
      "details": { "deletedUser": "student@example.com" },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1234,
  "stats": {
    "totalLogs": 1234,
    "byAction": {
      "USER_UPDATED": 450,
      "USER_DELETED": 23,
      "BULK_OPERATION": 12
    },
    "byResource": {
      "User": 580,
      "Material": 320,
      "Test": 180
    }
  }
}
```

### Audit Log Types

```typescript
// User Management
'USER_CREATED'
'USER_UPDATED'
'USER_DELETED'
'USER_ROLE_CHANGED'
'USER_VERIFIED'
'USER_BANNED'
'USER_UNBANNED'

// Content Management
'MATERIAL_CREATED'
'MATERIAL_UPDATED'
'MATERIAL_DELETED'
'TEST_CREATED'
'TEST_UPDATED'
'TEST_DELETED'

// Booking Management
'BOOKING_CANCELLED_BY_ADMIN'
'BOOKING_UPDATED'

// Payment Management
'PAYMENT_REFUNDED'
'PAYMENT_UPDATED'

// Reward Management
'REWARD_CREATED'
'REWARD_UPDATED'
'REWARD_DELETED'

// System
'SETTINGS_UPDATED'
'BULK_OPERATION'
'DATA_EXPORT'
'DATA_IMPORT'
```

### Persisting Audit Logs to Database

Za production, preporučuje se spremanje u bazu podataka.

**Dodaj model u `prisma/schema.prisma`:**
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  userEmail   String
  action      String
  resource    String
  resourceId  String?
  details     Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([action])
  @@index([resource])
  @@index([createdAt])
}
```

**Dodaj u User model:**
```prisma
model User {
  // ... existing fields
  auditLogs AuditLog[]
}
```

**Ažuriraj `lib/audit-logger.ts`:**
```typescript
import { prisma } from './prisma'

export async function logAudit(entry: Omit<AuditLogEntry, 'timestamp'>) {
  // ... existing code ...

  // Persist to database
  await prisma.auditLog.create({
    data: fullEntry,
  })
}
```

## 4. Monitoring Best Practices

### Development

1. **Koristi logging functions** - `console.log`, `console.warn`, `console.error`
2. **Testiraj slow queries** - Dodaj artificial delays za testiranje alerts
3. **Review performance summary** - Pozovi `logPerformanceSummary()` periodično
4. **Check error boundary** - Testiraj da Error Boundary radi

### Production

1. **Enable Sentry** - Konfiguriraj production DSN
2. **Monitor error rates** - Postavi alerting u Sentry dashboardu
3. **Review audit logs** - Periodično provjeri za suspicious activity
4. **Track performance trends** - Koristi APM tools (New Relic, Datadog)
5. **Set up alerts** - Za critical errors i slow responses

### Security

1. **Never log passwords** - Filtriraj sensitive data prije logginga
2. **Limit audit log access** - Samo admin može vidjeti audit logs
3. **Rotate logs** - U production, implementiraj log rotation
4. **Encrypt sensitive data** - PII u audit logs treba biti encrypted

### Scalability

1. **External logging service** - Za production, koristi ELK stack, Datadog, ili Cloudwatch
2. **Database audit logs** - Spremaj u bazu umjesto in-memory
3. **Log aggregation** - Centraliziraj logove sa više servera
4. **Retention policy** - Automatski briši stare logove (npr. nakon 90 dana)

## 5. Troubleshooting

### Sentry Errors Not Appearing

1. Provjeri da je `NEXT_PUBLIC_SENTRY_DSN` postavljen
2. Provjeri da je `initSentry()` pozvan
3. Check Sentry project settings u web dashboardu
4. Provjeri da errors nisu u `ignoreErrors` listi

### Performance Metrics Not Tracking

1. Provjeri da wrapper funkcije koriste `withPerformanceMonitoring`
2. Provjeri da je `startTimer()` pozvan prije operacije
3. Provjeri da je `timer.end()` pozvan nakon operacije
4. Check konzolu za logged metrics

### Audit Logs Missing

1. Provjeri da je `auditHelpers` ili `logAudit` pozvan
2. Provjeri da session.user postoji
3. Check konzolu - audit logs se logiraju u console
4. Za database persistence, provjeri da je model kreiran

## 6. Example Integration

### Complete Admin Route with All Monitoring

```typescript
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/auth-middleware'
import { withPerformanceMonitoring, trackDatabaseQuery } from '@/lib/performance-monitoring'
import { withErrorTracking, captureException } from '@/lib/sentry'
import { auditHelpers } from '@/lib/audit-logger'

// Combine all monitoring wrappers
export const DELETE = withAdmin(
  withPerformanceMonitoring(
    withErrorTracking(
      async (req: NextRequest, session, { params }: { params: { id: string } }) => {
        try {
          // Track database query performance
          const user = await trackDatabaseQuery('Find user', async () => {
            return await prisma.user.findUnique({
              where: { id: params.id },
            })
          })

          if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
          }

          // Delete user
          await prisma.user.delete({
            where: { id: params.id },
          })

          // Audit log
          await auditHelpers.userDeleted(params.id, user.email, session.user)

          return NextResponse.json({ success: true })
        } catch (error) {
          // Error is automatically captured by withErrorTracking
          // But you can add extra context here if needed
          captureException(error as Error, {
            operation: 'delete_user',
            userId: params.id,
            adminId: session.user.id,
          })
          throw error
        }
      },
      'DELETE /api/admin/users/[id]'
    )
  )
)
```

## 7. Zaključak

Monitoring sistem pruža:

- ✅ **Error Tracking** - Automatic error capture sa Sentry
- ✅ **Performance Monitoring** - Real-time response time tracking
- ✅ **Audit Logging** - Compliance-ready admin action logs
- ✅ **Developer-friendly** - Easy integration sa postojećim kodom
- ✅ **Production-ready** - Scalable i extensible architecture

Za production deployment:
1. Instaliraj Sentry package i konfiguriraj DSN
2. Dodaj AuditLog model u Prisma schema
3. Konfiguriraj external logging service (ELK, Datadog)
4. Postavi alerting u Sentry i APM tools
5. Implementiraj log retention policy

Za dodatnu pomoć, pogledaj:
- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Next.js Monitoring](https://nextjs.org/docs/advanced-features/measuring-performance)
