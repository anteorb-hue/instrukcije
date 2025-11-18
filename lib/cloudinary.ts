// Cloudinary upload service
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
  format: string
  resourceType: string
  bytes: number
  width?: number
  height?: number
  duration?: number
  pages?: number
}

/**
 * Upload file to Cloudinary
 * @param file - File as base64 string or buffer
 * @param options - Upload options
 */
export async function uploadToCloudinary(
  file: string | Buffer,
  options?: {
    folder?: string
    resourceType?: 'image' | 'video' | 'raw' | 'auto'
    publicId?: string
    allowedFormats?: string[]
  }
): Promise<UploadResult> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME is not configured')
  }

  try {
    const uploadOptions = {
      folder: options?.folder || 'instrukcije/materials',
      resource_type: options?.resourceType || 'auto',
      ...(options?.publicId && { public_id: options.publicId }),
      ...(options?.allowedFormats && { allowed_formats: options.allowedFormats }),
    }

    const result = await cloudinary.uploader.upload(file.toString(), uploadOptions as any)

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes,
      ...(result.width && { width: result.width }),
      ...(result.height && { height: result.height }),
      ...(result.duration && { duration: result.duration }),
      ...(result.pages && { pages: result.pages }),
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}

/**
 * Delete file from Cloudinary
 * @param publicId - The public ID of the file to delete
 * @param resourceType - The resource type (image, video, raw)
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'raw'
): Promise<void> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('CLOUDINARY_CLOUD_NAME is not configured. Skipping deletion.')
    return
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete file from Cloudinary')
  }
}

/**
 * Get signed upload URL for client-side uploads
 */
export function getCloudinarySignature(options: {
  folder?: string
  publicId?: string
  timestamp: number
}): { signature: string; timestamp: number; apiKey: string; cloudName: string } {
  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY) {
    throw new Error('Cloudinary credentials not configured')
  }

  const signature = cloudinary.utils.api_sign_request(
    {
      folder: options.folder || 'instrukcije/materials',
      ...(options.publicId && { public_id: options.publicId }),
      timestamp: options.timestamp,
    },
    process.env.CLOUDINARY_API_SECRET
  )

  return {
    signature,
    timestamp: options.timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  }
}

/**
 * Convert file to base64 for upload
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export default cloudinary
