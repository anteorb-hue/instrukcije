/**
 * Rate Limiting Utility
 *
 * Simple in-memory rate limiter using sliding window algorithm.
 * For production, consider using Redis for distributed rate limiting.
 */

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Maximum requests per interval
}

interface RequestLog {
  count: number
  resetTime: number
}

// In-memory storage for rate limit tracking
// Key: identifier (e.g., userId, IP address)
// Value: { count, resetTime }
const rateLimitStore = new Map<string, RequestLog>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (userId, IP, etc.)
 * @param config - Rate limit configuration
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
} {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  // No previous record or window has reset
  if (!record || now > record.resetTime) {
    const resetTime = now + config.interval
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    })

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    }
  }

  // Within rate limit
  if (record.count < config.maxRequests) {
    record.count++
    rateLimitStore.set(identifier, record)

    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime,
    }
  }

  // Rate limit exceeded
  const retryAfter = Math.ceil((record.resetTime - now) / 1000)

  return {
    allowed: false,
    remaining: 0,
    resetTime: record.resetTime,
    retryAfter,
  }
}

/**
 * Rate limit presets for common use cases
 */
export const RateLimitPresets = {
  // Strict limits for sensitive operations
  STRICT: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 5,
  },
  // Standard limits for API endpoints
  STANDARD: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 30,
  },
  // Relaxed limits for read operations
  RELAXED: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 100,
  },
  // Messages - prevent spam
  MESSAGES: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 20,
  },
  // Auth operations - prevent brute force
  AUTH: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
}

/**
 * Middleware helper to apply rate limiting to API routes
 * Usage:
 *
 * const rateLimitResult = checkRateLimit(userId, RateLimitPresets.MESSAGES)
 * if (!rateLimitResult.allowed) {
 *   return NextResponse.json(
 *     { error: 'Rate limit exceeded' },
 *     {
 *       status: 429,
 *       headers: {
 *         'X-RateLimit-Limit': config.maxRequests.toString(),
 *         'X-RateLimit-Remaining': '0',
 *         'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
 *         'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
 *       },
 *     }
 *   )
 * }
 */
