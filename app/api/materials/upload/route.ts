import { NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

// POST /api/materials/upload - Upload file to Cloudinary
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB' },
        { status: 400 }
      )
    }

    // Determine resource type based on MIME type
    const resourceType = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
      ? 'video'
      : 'raw'

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert to base64
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await uploadToCloudinary(base64, {
      folder: 'instrukcije/materials',
      resourceType: resourceType as any,
    })

    // Determine material type
    let materialType: string = 'OTHER'
    if (file.type.startsWith('video/')) materialType = 'VIDEO'
    else if (file.type === 'application/pdf') materialType = 'PDF'
    else if (
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      materialType = 'DOCUMENT'
    else if (
      file.type === 'application/vnd.ms-powerpoint' ||
      file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    )
      materialType = 'PRESENTATION'
    else if (file.type.startsWith('image/')) materialType = 'IMAGE'
    else if (file.type.startsWith('audio/')) materialType = 'AUDIO'
    else if (
      file.type === 'application/zip' ||
      file.type === 'application/x-rar-compressed'
    )
      materialType = 'ARCHIVE'

    return NextResponse.json({
      success: true,
      file: {
        url: result.url,
        publicId: result.publicId,
        fileName: file.name,
        fileSize: result.bytes,
        mimeType: file.type,
        type: materialType,
        ...(result.duration && { duration: Math.floor(result.duration) }),
        ...(result.pages && { pageCount: result.pages }),
      },
    })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// GET /api/materials/upload/signature - Get Cloudinary signature for client-side uploads
export async function GET(req: Request) {
  try {
    const { getCloudinarySignature } = await import('@/lib/cloudinary')

    const timestamp = Math.round(new Date().getTime() / 1000)

    const signature = getCloudinarySignature({
      folder: 'instrukcije/materials',
      timestamp,
    })

    return NextResponse.json(signature)
  } catch (error: any) {
    console.error('Error generating signature:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate signature' },
      { status: 500 }
    )
  }
}
