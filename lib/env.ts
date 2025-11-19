/**
 * Environment Variable Validation
 *
 * Validates all required environment variables at build/startup time
 * Prevents runtime errors due to missing or invalid configuration
 */

import { z } from 'zod'

// Define schema for server-side environment variables
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // NextAuth
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters for security'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'STRIPE_SECRET_KEY must start with sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', 'STRIPE_WEBHOOK_SECRET must start with whsec_'),

  // Email (Resend)
  RESEND_API_KEY: z.string().startsWith('re_', 'RESEND_API_KEY must start with re_'),
  EMAIL_FROM: z.string().email('EMAIL_FROM must be a valid email address'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  // Video Providers (Optional - may not be configured initially)
  ZOOM_CLIENT_ID: z.string().optional(),
  ZOOM_CLIENT_SECRET: z.string().optional(),
  ZOOM_ACCOUNT_ID: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),

  // Socket.io
  SOCKET_PORT: z.string().regex(/^\d+$/, 'SOCKET_PORT must be a number').optional().default('3001'),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Define schema for client-side (public) environment variables
const clientEnvSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),
  NEXT_PUBLIC_MAX_FILE_SIZE: z.string().regex(/^\d+$/, 'NEXT_PUBLIC_MAX_FILE_SIZE must be a number').optional().default('5242880'),
})

// Merge schemas for complete validation
const envSchema = serverEnvSchema.merge(clientEnvSchema)

/**
 * Validate environment variables
 * Should be called at application startup (in instrumentation.ts or app layout)
 */
export function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env)

    // Log successful validation in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Environment variables validated successfully')
    }

    return parsed
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment variable validation failed:')
      console.error(error.errors.map((e) => `  - ${e.path.join('.')}: ${e.message}`).join('\n'))

      // In production, fail fast - don't start the app with invalid config
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Invalid environment variables. Check logs for details.')
      }

      // In development, warn but allow to continue
      console.warn('⚠️  Continuing with invalid environment variables (development mode)')
    }
    throw error
  }
}

/**
 * Get type-safe environment variables
 * Only use this after calling validateEnv()
 */
export function getEnv() {
  return process.env as z.infer<typeof envSchema>
}

// Validate on module load (server-side only)
if (typeof window === 'undefined') {
  validateEnv()
}
