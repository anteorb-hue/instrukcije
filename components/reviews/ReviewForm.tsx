'use client'

import React, { useState } from 'react'
import { Star, Upload, X, Image as ImageIcon, Video } from 'lucide-react'
import StarRating from './StarRating'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface ReviewFormProps {
  bookingId: string
  tutorName: string
  onSubmit?: (review: ReviewData) => void
  onCancel?: () => void
}

interface ReviewData {
  rating: number
  comment: string
  communication?: number
  expertise?: number
  punctuality?: number
  photos?: File[]
  videos?: File[]
}

export default function ReviewForm({
  bookingId,
  tutorName,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [communication, setCommunication] = useState(0)
  const [expertise, setExpertise] = useState(0)
  const [punctuality, setPunctuality] = useState(0)
  const [photos, setPhotos] = useState<File[]>([])
  const [videos, setVideos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [videoPreviews, setVideoPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (photos.length + files.length > 5) {
      toast.error('Maksimalno 5 fotografija')
      return
    }

    // VALIDATION: File type and size
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

    const validFiles: File[] = []

    for (const file of files) {
      // Validate MIME type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Dozvoljeni su samo JPEG, PNG, WebP i GIF formati`)
        continue
      }

      // Validate file size
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name}: Fotografija ne smije biti veća od 5MB`)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) {
      return
    }

    setPhotos([...photos, ...validFiles])

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (videos.length + files.length > 2) {
      toast.error('Maksimalno 2 videa')
      return
    }

    // VALIDATION: File type and size
    const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB

    const validFiles: File[] = []

    for (const file of files) {
      // Validate MIME type
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Dozvoljeni su samo MP4, WebM, MOV i AVI formati`)
        continue
      }

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        toast.error(`${file.name}: Video ne smije biti veći od 50MB`)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) {
      return
    }

    setVideos([...videos, ...validFiles])

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setVideoPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index))
    setVideoPreviews(videoPreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) {
      return // Prevent double submission
    }

    if (rating === 0) {
      toast.error('Molimo odaberite ocjenu')
      return
    }

    if (!comment.trim()) {
      toast.error('Molimo napišite komentar')
      return
    }

    const reviewData: ReviewData = {
      rating,
      comment,
      communication,
      expertise,
      punctuality,
      photos,
      videos,
    }

    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(reviewData)
      }
      toast.success('Recenzija uspješno poslana!')
    } catch (error) {
      toast.error('Greška pri slanju recenzije')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label={`Forma za ocjenu instruktora ${tutorName}`}>
      {/* Overall Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Ukupna ocjena <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-4">
          <StarRating rating={rating} onRatingChange={setRating} size="lg" />
          {rating > 0 && (
            <span className="text-lg font-bold text-gray-900">{rating}/5</span>
          )}
        </div>
      </div>

      {/* Detailed Ratings */}
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Komunikacija
          </label>
          <StarRating
            rating={communication}
            onRatingChange={setCommunication}
            size="md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stručnost
          </label>
          <StarRating
            rating={expertise}
            onRatingChange={setExpertise}
            size="md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Točnost
          </label>
          <StarRating
            rating={punctuality}
            onRatingChange={setPunctuality}
            size="md"
          />
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Vaše iskustvo <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="input-field"
          placeholder={`Opišite vaše iskustvo s ${tutorName}...`}
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/1000 znakova
        </p>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" id="photo-upload-label">
          Dodaj fotografije (opciono)
        </label>
        <div className="space-y-3">
          <label className={isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={isSubmitting}
              aria-label="Upload fotografija za recenziju"
              aria-describedby="photo-upload-label"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors" role="button" tabIndex={0}>
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-gray-600">
                Klikni za upload fotografija (max 5)
              </p>
            </div>
          </label>

          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-2" role="list" aria-label="Uploadane fotografije">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative group" role="listitem">
                  <img
                    src={preview}
                    alt={`Fotografija ${index + 1} od ${photoPreviews.length}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Ukloni fotografiju ${index + 1}`}
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" id="video-upload-label">
          Dodaj video (opciono)
        </label>
        <div className="space-y-3">
          <label className={isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
              className="hidden"
              disabled={isSubmitting}
              aria-label="Upload video snimaka za recenziju"
              aria-describedby="video-upload-label"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors" role="button" tabIndex={0}>
              <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-gray-600">
                Klikni za upload videa (max 2)
              </p>
            </div>
          </label>

          {videoPreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-2" role="list" aria-label="Uploadani video snimci">
              {videoPreviews.map((preview, index) => (
                <div key={index} className="relative group" role="listitem">
                  <video
                    src={preview}
                    className="w-full h-32 object-cover rounded-lg"
                    aria-label={`Video snimak ${index + 1} od ${videoPreviews.length}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Ukloni video snimak ${index + 1}`}
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-900">
          <strong>Napomena:</strong> Vaša recenzija će biti vidljiva svim korisnicima. Molimo
          budite iskreni i konstruktivni.
        </p>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <Button type="submit" variant="primary" className="flex-1" loading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? 'Šaljem...' : 'Pošalji recenziju'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
            Odustani
          </Button>
        )}
      </div>
    </form>
  )
}
