// Performance monitoring utilities

export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`)
}

export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`)
  return result
}

// Report Web Vitals (for production monitoring)
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric)
  }

  // In production, send to analytics service
  // Example: analytics.track('web-vitals', metric)
}

// Memory usage monitoring (development only)
export function logMemoryUsage() {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = (performance as any).memory
    console.log('[Memory]', {
      used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    })
  }
}

// Image optimization helper
export function getOptimizedImageUrl(url: string, width?: number, quality = 75) {
  // For dicebear avatars, they're already optimized SVGs
  if (url.includes('dicebear.com')) {
    return url
  }

  // For other images, you can use Next.js Image Optimization API
  // or a CDN service like Cloudinary, imgix, etc.
  return url
}

// Debounce utility for search/filter inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
