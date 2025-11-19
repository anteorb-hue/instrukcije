import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkRateLimit, RateLimitPresets } from '@/lib/rate-limit'

describe('rate-limit', () => {
  beforeEach(() => {
    // Reset time mocks if any
    vi.restoreAllMocks()
  })

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('test-user-1', {
        interval: 60000, // 1 minute
        maxRequests: 5,
      })

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4) // 5 - 1 = 4
      expect(result.resetTime).toBeGreaterThan(Date.now())
    })

    it('should track multiple requests for same identifier', () => {
      const config = { interval: 60000, maxRequests: 3 }
      const identifier = 'test-user-2'

      const result1 = checkRateLimit(identifier, config)
      expect(result1.allowed).toBe(true)
      expect(result1.remaining).toBe(2)

      const result2 = checkRateLimit(identifier, config)
      expect(result2.allowed).toBe(true)
      expect(result2.remaining).toBe(1)

      const result3 = checkRateLimit(identifier, config)
      expect(result3.allowed).toBe(true)
      expect(result3.remaining).toBe(0)
    })

    it('should block requests after limit is exceeded', () => {
      const config = { interval: 60000, maxRequests: 2 }
      const identifier = 'test-user-3'

      // First two requests should pass
      checkRateLimit(identifier, config)
      checkRateLimit(identifier, config)

      // Third request should be blocked
      const result = checkRateLimit(identifier, config)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.retryAfter).toBeGreaterThan(0)
    })

    it('should track different identifiers separately', () => {
      const config = { interval: 60000, maxRequests: 2 }

      const result1 = checkRateLimit('user-a', config)
      expect(result1.allowed).toBe(true)

      const result2 = checkRateLimit('user-b', config)
      expect(result2.allowed).toBe(true)

      // Both should have their own limits
      expect(result1.remaining).toBe(1)
      expect(result2.remaining).toBe(1)
    })

    it('should reset after time window expires', () => {
      const config = { interval: 1000, maxRequests: 2 } // 1 second window
      const identifier = 'test-user-4'

      // Exhaust the limit
      checkRateLimit(identifier, config)
      checkRateLimit(identifier, config)

      // Should be blocked
      let result = checkRateLimit(identifier, config)
      expect(result.allowed).toBe(false)

      // Wait for window to expire
      const sleepUntil = result.resetTime + 100 // Add buffer
      vi.setSystemTime(sleepUntil)

      // Should be allowed again after reset
      result = checkRateLimit(identifier, config)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(1)
    })

    it('should provide correct retry after value', () => {
      const config = { interval: 60000, maxRequests: 1 }
      const identifier = 'test-user-5'

      // First request
      checkRateLimit(identifier, config)

      // Second request should be blocked
      const result = checkRateLimit(identifier, config)
      expect(result.allowed).toBe(false)
      expect(result.retryAfter).toBeDefined()
      expect(result.retryAfter).toBeGreaterThan(0)
      expect(result.retryAfter).toBeLessThanOrEqual(60) // Should be <= 60 seconds
    })

    it('should handle very short intervals', () => {
      const config = { interval: 100, maxRequests: 2 } // 100ms window
      const identifier = 'test-user-6'

      const result1 = checkRateLimit(identifier, config)
      const result2 = checkRateLimit(identifier, config)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)

      const result3 = checkRateLimit(identifier, config)
      expect(result3.allowed).toBe(false)
    })

    it('should handle high request limits', () => {
      const config = { interval: 60000, maxRequests: 100 }
      const identifier = 'test-user-7'

      // Make 50 requests
      for (let i = 0; i < 50; i++) {
        const result = checkRateLimit(identifier, config)
        expect(result.allowed).toBe(true)
      }

      // Check remaining count
      const result = checkRateLimit(identifier, config)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(49) // 100 - 51 = 49
    })
  })

  describe('RateLimitPresets', () => {
    it('should have STRICT preset', () => {
      expect(RateLimitPresets.STRICT).toBeDefined()
      expect(RateLimitPresets.STRICT.interval).toBe(60 * 1000) // 1 minute
      expect(RateLimitPresets.STRICT.maxRequests).toBe(5)
    })

    it('should have STANDARD preset', () => {
      expect(RateLimitPresets.STANDARD).toBeDefined()
      expect(RateLimitPresets.STANDARD.interval).toBe(60 * 1000) // 1 minute
      expect(RateLimitPresets.STANDARD.maxRequests).toBe(30)
    })

    it('should have RELAXED preset', () => {
      expect(RateLimitPresets.RELAXED).toBeDefined()
      expect(RateLimitPresets.RELAXED.interval).toBe(60 * 1000) // 1 minute
      expect(RateLimitPresets.RELAXED.maxRequests).toBe(100)
    })

    it('should have MESSAGES preset', () => {
      expect(RateLimitPresets.MESSAGES).toBeDefined()
      expect(RateLimitPresets.MESSAGES.interval).toBe(60 * 1000) // 1 minute
      expect(RateLimitPresets.MESSAGES.maxRequests).toBe(20)
    })

    it('should have AUTH preset', () => {
      expect(RateLimitPresets.AUTH).toBeDefined()
      expect(RateLimitPresets.AUTH.interval).toBe(15 * 60 * 1000) // 15 minutes
      expect(RateLimitPresets.AUTH.maxRequests).toBe(5)
    })

    it('STRICT preset should work correctly', () => {
      const identifier = 'strict-test-user'

      // Should allow 5 requests
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(identifier, RateLimitPresets.STRICT)
        expect(result.allowed).toBe(true)
      }

      // 6th request should be blocked
      const result = checkRateLimit(identifier, RateLimitPresets.STRICT)
      expect(result.allowed).toBe(false)
    })

    it('AUTH preset should have longer interval', () => {
      const identifier = 'auth-test-user'

      // Exhaust limit
      for (let i = 0; i < 5; i++) {
        checkRateLimit(identifier, RateLimitPresets.AUTH)
      }

      // Check retry after is around 15 minutes
      const result = checkRateLimit(identifier, RateLimitPresets.AUTH)
      expect(result.allowed).toBe(false)
      expect(result.retryAfter).toBeGreaterThan(0)
      expect(result.retryAfter).toBeLessThanOrEqual(900) // 15 minutes = 900 seconds
    })
  })

  describe('edge cases', () => {
    it('should handle empty identifier string', () => {
      const config = { interval: 60000, maxRequests: 5 }

      const result = checkRateLimit('', config)
      expect(result.allowed).toBe(true)
    })

    it('should handle special characters in identifier', () => {
      const config = { interval: 60000, maxRequests: 5 }
      const specialIdentifier = 'user@#$%^&*()_+'

      const result = checkRateLimit(specialIdentifier, config)
      expect(result.allowed).toBe(true)
    })

    it('should handle very long identifiers', () => {
      const config = { interval: 60000, maxRequests: 5 }
      const longIdentifier = 'a'.repeat(1000)

      const result = checkRateLimit(longIdentifier, config)
      expect(result.allowed).toBe(true)
    })

    it('should handle zero maxRequests gracefully', () => {
      const config = { interval: 60000, maxRequests: 0 }
      const identifier = 'zero-limit-user'

      const result = checkRateLimit(identifier, config)
      // With 0 max requests, first request should be blocked
      expect(result.allowed).toBe(false)
    })

    it('should handle concurrent requests for same identifier', () => {
      const config = { interval: 60000, maxRequests: 10 }
      const identifier = 'concurrent-user'

      // Simulate 5 concurrent requests
      const results = []
      for (let i = 0; i < 5; i++) {
        results.push(checkRateLimit(identifier, config))
      }

      // All should be allowed
      results.forEach((result) => {
        expect(result.allowed).toBe(true)
      })

      // Remaining should decrease properly
      expect(results[results.length - 1].remaining).toBe(5) // 10 - 5 = 5
    })
  })

  describe('performance', () => {
    it('should handle many different identifiers efficiently', () => {
      const config = { interval: 60000, maxRequests: 5 }
      const startTime = Date.now()

      // Create 1000 different users
      for (let i = 0; i < 1000; i++) {
        checkRateLimit(`user-${i}`, config)
      }

      const duration = Date.now() - startTime

      // Should complete in reasonable time (< 100ms for 1000 operations)
      expect(duration).toBeLessThan(100)
    })

    it('should handle burst of requests efficiently', () => {
      const config = { interval: 60000, maxRequests: 100 }
      const identifier = 'burst-user'
      const startTime = Date.now()

      // Make 100 requests
      for (let i = 0; i < 100; i++) {
        checkRateLimit(identifier, config)
      }

      const duration = Date.now() - startTime

      // Should complete quickly
      expect(duration).toBeLessThan(50)
    })
  })
})
