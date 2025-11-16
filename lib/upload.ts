import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export interface UploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  folder?: string
}

export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<{ url: string; filename: string }> {
  const {
    maxSize = MAX_FILE_SIZE,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    folder = 'general',
  } = options

  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`)
  }

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`)
  }

  // Create upload directory if it doesn't exist
  const uploadPath = join(UPLOAD_DIR, folder)
  try {
    await mkdir(uploadPath, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }

  // Generate unique filename
  const extension = file.name.split('.').pop()
  const filename = `${uuidv4()}.${extension}`
  const filepath = join(uploadPath, filename)

  // Convert File to Buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Write file
  await writeFile(filepath, buffer)

  // Return public URL
  const url = `/uploads/${folder}/${filename}`

  return { url, filename }
}

export async function uploadAvatar(file: File): Promise<string> {
  const result = await uploadFile(file, {
    maxSize: 2 * 1024 * 1024, // 2MB for avatars
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    folder: 'avatars',
  })

  return result.url
}

export async function uploadDocument(file: File): Promise<string> {
  const result = await uploadFile(file, {
    maxSize: 10 * 1024 * 1024, // 10MB for documents
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    folder: 'documents',
  })

  return result.url
}

export async function uploadChatAttachment(file: File): Promise<string> {
  const result = await uploadFile(file, {
    maxSize: 5 * 1024 * 1024, // 5MB for chat attachments
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    folder: 'chat',
  })

  return result.url
}

export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
  return file.size <= maxSize
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || ''
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
