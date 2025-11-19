/**
 * Performance Monitoring Utilities
 *
 * Track API response times, slow queries, and cache performance
 */

import { NextRequest, NextResponse } from 'next/server'
import { captureMessage, addBreadcrumb } from './sentry'
import { cache } from './cache'

// Performance thresholds (in milliseconds)
export const THRESHOLDS = {
  API_RESPONSE_SLOW: 1000, // 1 second
  API_RESPONSE_CRITICAL: 3000, // 3 seconds
  DATABASE_QUERY_SLOW: 500, // 500ms
  DATABASE_QUERY_CRITICAL: 2000, // 2 seconds
} as const

interface PerformanceMetric {
  operation: string
  duration: number
  timestamp: number
  metadata?: Record<string, any>
}

// In-memory storage for performance metrics (last 1000 entries)
const performanceMetrics: PerformanceMetric[] = []
const MAX_METRICS = 1000

/**
 * Record a performance metric
 */
export function recordMetric(metric: PerformanceMetric) {
  performanceMetrics.push(metric)

  // Keep only last MAX_METRICS entries
  if (performanceMetrics.length > MAX_METRICS) {
    performanceMetrics.shift()
  }

  // Log slow operations
  if (metric.duration > THRESHOLDS.API_RESPONSE_SLOW) {
    console.warn(`Slow operation detected: ${metric.operation} took ${metric.duration}ms`)

    // Report critical slowness to Sentry
    if (metric.duration > THRESHOLDS.API_RESPONSE_CRITICAL) {
      captureMessage(
        `Critical slow operation: ${metric.operation}`,
        'warning',
        {
          duration: metric.duration,
          operation: metric.operation,
          metadata: metric.metadata,
        }
      )
    }
  }
}

/**
 * Performance Timer Class
 */
export class PerformanceTimer {
  private startTime: number
  private operation: string
  private metadata?: Record<string, any>

  constructor(operation: string, metadata?: Record<string, any>) {
    this.operation = operation
    this.metadata = metadata
    this.startTime = performance.now()
  }

  /**
   * End the timer and record the metric
   */
  end(): number {
    const duration = Math.round(performance.now() - this.startTime)

    recordMetric({
      operation: this.operation,
      duration,
      timestamp: Date.now(),
      metadata: this.metadata,
    })

    return duration
  }

  /**
   * End the timer and log the result
   */
  endAndLog(): number {
    const duration = this.end()
    console.log(`⏱️  ${this.operation}: ${duration}ms`)
    return duration
  }
}

/**
 * Start a performance timer
 */
export function startTimer(operation: string, metadata?: Record<string, any>): PerformanceTimer {
  return new PerformanceTimer(operation, metadata)
}

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const timer = startTimer(operation, metadata)

  try {
    const result = await fn()
    timer.end()
    return result
  } catch (error) {
    timer.end()
    throw error
  }
}

/**
 * Measure sync function execution time
 */
export function measureSync<T>(
  operation: string,
  fn: () => T,
  metadata?: Record<string, any>
): T {
  const timer = startTimer(operation, metadata)

  try {
    const result = fn()
    timer.end()
    return result
  } catch (error) {
    timer.end()
    throw error
  }
}

/**
 * API Route Performance Middleware
 */
export function withPerformanceMonitoring(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>,
  routeName?: string
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const operation = routeName || `${req.method} ${req.nextUrl.pathname}`
    const timer = startTimer(operation, {
      method: req.method,
      path: req.nextUrl.pathname,
      query: Object.fromEntries(req.nextUrl.searchParams),
    })

    try {
      const response = await handler(req, ...args)
      const duration = timer.end()

      // Add performance header to response
      response.headers.set('X-Response-Time', `${duration}ms`)

      return response
    } catch (error) {
      timer.end()
      throw error
    }
  }
}

/**
 * Database Query Performance Tracking
 */
export async function trackDatabaseQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const timer = startTimer(`DB: ${queryName}`)

  try {
    const result = await queryFn()
    const duration = timer.end()

    // Warn about slow queries
    if (duration > THRESHOLDS.DATABASE_QUERY_SLOW) {
      console.warn(`🐌 Slow query: ${queryName} took ${duration}ms`)
    }

    // Add breadcrumb for debugging
    addBreadcrumb(
      `Database query: ${queryName}`,
      'query',
      duration > THRESHOLDS.DATABASE_QUERY_SLOW ? 'warning' : 'info',
      { duration }
    )

    return result
  } catch (error) {
    timer.end()
    throw error
  }
}

/**
 * Get performance statistics
 */
export function getPerformanceStats(operation?: string) {
  const metrics = operation
    ? performanceMetrics.filter(m => m.operation.includes(operation))
    : performanceMetrics

  if (metrics.length === 0) {
    return {
      count: 0,
      avg: 0,
      min: 0,
      max: 0,
      p50: 0,
      p95: 0,
      p99: 0,
    }
  }

  const durations = metrics.map(m => m.duration).sort((a, b) => a - b)
  const sum = durations.reduce((acc, val) => acc + val, 0)

  return {
    count: metrics.length,
    avg: Math.round(sum / metrics.length),
    min: durations[0],
    max: durations[durations.length - 1],
    p50: durations[Math.floor(durations.length * 0.5)],
    p95: durations[Math.floor(durations.length * 0.95)],
    p99: durations[Math.floor(durations.length * 0.99)],
  }
}

/**
 * Get cache performance statistics
 */
export function getCacheStats() {
  return cache.stats()
}

/**
 * Log performance summary (useful for debugging)
 */
export function logPerformanceSummary() {
  console.log('\n📊 Performance Summary:')

  // Group metrics by operation type
  const operationTypes = new Set(
    performanceMetrics.map(m => {
      if (m.operation.startsWith('DB:')) return 'Database'
      if (m.operation.startsWith('GET') || m.operation.startsWith('POST')) return 'API'
      return 'Other'
    })
  )

  operationTypes.forEach(type => {
    const stats = getPerformanceStats(type)
    console.log(`\n${type}:`)
    console.log(`  Count: ${stats.count}`)
    console.log(`  Avg: ${stats.avg}ms`)
    console.log(`  P50: ${stats.p50}ms`)
    console.log(`  P95: ${stats.p95}ms`)
    console.log(`  Max: ${stats.max}ms`)
  })

  // Cache stats
  const cacheStats = getCacheStats()
  console.log('\nCache:')
  console.log(`  Hits: ${cacheStats.hits}`)
  console.log(`  Misses: ${cacheStats.misses}`)
  console.log(`  Hit Rate: ${cacheStats.hitRate.toFixed(2)}%`)
  console.log(`  Size: ${cacheStats.size} entries`)
}

/**
 * Prisma middleware for query performance tracking
 */
export function createPrismaPerformanceMiddleware() {
  return async (params: any, next: any) => {
    const timer = startTimer(`DB: ${params.model}.${params.action}`, {
      model: params.model,
      action: params.action,
    })

    try {
      const result = await next(params)
      const duration = timer.end()

      // Log slow queries in development
      if (process.env.NODE_ENV === 'development' && duration > THRESHOLDS.DATABASE_QUERY_SLOW) {
        console.warn(`🐌 Slow Prisma query: ${params.model}.${params.action} took ${duration}ms`)
      }

      return result
    } catch (error) {
      timer.end()
      throw error
    }
  }
}

/**
 * Reset performance metrics (useful for testing)
 */
export function resetMetrics() {
  performanceMetrics.length = 0
}
