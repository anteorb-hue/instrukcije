// Client-side file upload utilities

export interface ClientUploadResult {
  success: boolean
  url?: string
  error?: string
}

// Upload file from client to API
export async function uploadFileClient(
  file: File,
  endpoint: string = '/api/upload'
): Promise<ClientUploadResult> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Upload failed')
    }

    const data = await response.json()

    return {
      success: true,
      url: data.url,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

// Generate image preview
export function generateImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

// Compress image before upload
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file)
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context unavailable'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'))
              return
            }

            resolve(
              new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
            )
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('Image load failed'))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsDataURL(file)
  })
}
