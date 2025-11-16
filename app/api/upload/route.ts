import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadFile, uploadAvatar, uploadDocument } from '@/lib/upload'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Neautorizirano' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'avatar' | 'document' | 'general'

    if (!file) {
      return NextResponse.json(
        { error: 'Nema datoteke' },
        { status: 400 }
      )
    }

    let url: string

    switch (type) {
      case 'avatar':
        url = await uploadAvatar(file)
        break
      case 'document':
        url = await uploadDocument(file)
        break
      default:
        const result = await uploadFile(file)
        url = result.url
    }

    return NextResponse.json({ url }, { status: 200 })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Greška pri uploadu' },
      { status: 500 }
    )
  }
}
