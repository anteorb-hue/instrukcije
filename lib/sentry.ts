/**
 * Sentry Error Tracking Configuration
 *
 * To enable Sentry, install the package:
 * npm install @sentry/nextjs
 *
 * Then add NEXT_PUBLIC_SENTRY_DSN to your .env.local
 */

// This is a placeholder implementation that safely handles missing Sentry
// When @sentry/nextjs is installed, this will work automatically

let Sentry: any = null

try {
  // Try to import Sentry if it's installed
  if (typeof window !== 'undefined') {
    Sentry = require('@sentry/nextjs')
  } else {
    Sentry = require('@sentry/nextjs')
  }
} catch (e) {
  // Sentry not installed, use mock implementation
  console.log('Sentry not installed. Error tracking disabled.')
}

export const isSentryEnabled = !!Sentry && !!process.env.NEXT_PUBLIC_SENTRY_DSN

/**
 * Initialize Sentry
 */
export function initSentry() {
  if (!isSentryEnabled) return

  const isProduction = process.env.NODE_ENV === 'production'

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Adjust sample rates based on environment
    tracesSampleRate: isProduction ? 0.1 : 1.0,

    // Capture 100% of errors in production, 10% in development
    sampleRate: isProduction ? 1.0 : 0.1,

    // Only send sessions in production
    replaysSessionSampleRate: isProduction ? 0.1 : 0,
    replaysOnErrorSampleRate: isProduction ? 1.0 : 0,

    beforeSend(event, hint) {
      // Filter out errors we don't care about
      if (event.exception) {
        const error = hint.originalException as Error

        // Ignore network errors
        if (error?.message?.includes('NetworkError')) {
          return null
        }

        // Ignore cancelled requests
        if (error?.message?.includes('AbortError')) {
          return null
        }
      }

      return event
    },

    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
      // Random plugins/extensions
      'Can\'t find variable: ZiteReader',
      'jigsaw is not defined',
      'ComboSearch is not defined',
      // Facebook issues
      'fb_xd_fragment',
      // Network errors
      'NetworkError',
      'Network request failed',
      // Ignore common user errors
      'Non-Error promise rejection captured',
    ],
  })
}

/**
 * Capture an exception with context
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (!isSentryEnabled) {
    console.error('Error:', error, 'Context:', context)
    return
  }

  if (context) {
    Sentry.setContext('additional_info', context)
  }

  Sentry.captureException(error)
}

/**
 * Capture a message with optional level
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' | 'debug' = 'info',
  context?: Record<string, any>
) {
  if (!isSentryEnabled) {
    console[level === 'warning' ? 'warn' : level](message, context)
    return
  }

  if (context) {
    Sentry.setContext('additional_info', context)
  }

  Sentry.captureMessage(message, level)
}

/**
 * Set user context for error tracking
 */
export function setUser(user: {
  id: string
  email?: string
  username?: string
  role?: string
}) {
  if (!isSentryEnabled) return

  Sentry.setUser(user)
}

/**
 * Clear user context (on logout)
 */
export function clearUser() {
  if (!isSentryEnabled) return

  Sentry.setUser(null)
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: 'info' | 'warning' | 'error' | 'debug' = 'info',
  data?: Record<string, any>
) {
  if (!isSentryEnabled) return

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  })
}

/**
 * Wrap API route handler with error tracking
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  handlerName?: string
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      captureException(error as Error, {
        handler: handlerName || handler.name,
        args: args.map(arg => {
          // Sanitize arguments to avoid sending sensitive data
          if (arg?.headers) return '[Request]'
          if (arg?.json) return '[Response]'
          return arg
        }),
      })
      throw error
    }
  }) as T
}

/**
 * Performance tracking for API endpoints
 */
export function trackPerformance(
  operationName: string,
  data?: Record<string, any>
) {
  if (!isSentryEnabled) return () => {}

  const transaction = Sentry.startTransaction({
    op: 'api',
    name: operationName,
    data,
  })

  return () => {
    transaction.finish()
  }
}
