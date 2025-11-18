/**
 * Caching utilities
 *
 * Implementacija in-memory cache-a sa TTL (Time To Live).
 * Za production, zamijeniti sa Redis ili drugim persistent cache-om.
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

class Cache {
  private store: Map<string, CacheEntry<any>>
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.store = new Map()
    this.startCleanup()
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set value in cache with TTL in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000

    this.store.set(key, {
      data,
      expiresAt,
    })
  }

  /**
   * Delete key from cache
   */
  delete(key: string): void {
    this.store.delete(key)
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Get cache stats
   */
  stats() {
    const now = Date.now()
    let activeEntries = 0
    let expiredEntries = 0

    for (const [, entry] of this.store) {
      if (now > entry.expiresAt) {
        expiredEntries++
      } else {
        activeEntries++
      }
    }

    return {
      total: this.store.size,
      active: activeEntries,
      expired: expiredEntries,
    }
  }

  /**
   * Clean up expired entries every 5 minutes
   */
  private startCleanup() {
    this.cleanupInterval = setInterval(
      () => {
        const now = Date.now()
        for (const [key, entry] of this.store) {
          if (now > entry.expiresAt) {
            this.store.delete(key)
          }
        }
      },
      5 * 60 * 1000
    ) // Every 5 minutes
  }

  /**
   * Stop cleanup interval (for testing)
   */
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// Singleton instance
export const cache = new Cache()

/**
 * Cache decorator za funkcije
 *
 * @param keyPrefix - Prefix za cache key
 * @param ttlSeconds - TTL u sekundama (default: 5 minuta)
 */
export function withCache<T>(
  keyPrefix: string,
  ttlSeconds: number = 300
): (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => PropertyDescriptor {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]): Promise<T> {
      // Build cache key from arguments
      const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`

      // Try to get from cache
      const cached = cache.get<T>(cacheKey)
      if (cached !== null) {
        return cached
      }

      // Call original method
      const result = await originalMethod.apply(this, args)

      // Store in cache
      cache.set(cacheKey, result, ttlSeconds)

      return result
    }

    return descriptor
  }
}

/**
 * Helper za cache-or-fetch pattern
 *
 * @param key - Cache key
 * @param fetchFn - Funkcija za fetch podataka ako nisu u cache-u
 * @param ttlSeconds - TTL u sekundama
 */
export async function cacheOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // Try cache first
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const data = await fetchFn()

  // Store in cache
  cache.set(key, data, ttlSeconds)

  return data
}

/**
 * Invalidate cache by pattern
 *
 * @param pattern - String koji cache key mora sadržavati
 */
export function invalidateCacheByPattern(pattern: string): number {
  let count = 0
  const keysToDelete: string[] = []

  for (const key of (cache as any).store.keys()) {
    if (key.includes(pattern)) {
      keysToDelete.push(key)
    }
  }

  keysToDelete.forEach((key) => {
    cache.delete(key)
    count++
  })

  return count
}

/**
 * Cache TTL constants (u sekundama)
 */
export const CACHE_TTL = {
  SHORT: 60, // 1 minuta - za često mijenjajuće podatke
  MEDIUM: 300, // 5 minuta - za normalne podatke
  LONG: 900, // 15 minuta - za rijetko mijenjajuće podatke
  HOUR: 3600, // 1 sat - za gotovo statične podatke
  DAY: 86400, // 1 dan - za statične podatke
} as const

/**
 * Cache invalidation patterns
 */
export const CACHE_PATTERNS = {
  ANALYTICS: 'analytics',
  USERS: 'users',
  MATERIALS: 'materials',
  TESTS: 'tests',
  HOMEWORK: 'homework',
  BOOKINGS: 'bookings',
} as const
