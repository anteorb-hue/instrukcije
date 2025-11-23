'use client'

import React, { useState } from 'react'
import { X, Image as ImageIcon, Video } from 'lucide-react'
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
  bookingId: _bookingId,
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (photos.length + files.length > 5) {
      toast.error('Maksimalno 5 fotografija')
      return
    }

    setPhotos([...photos, ...files])

    // Create previews
    files.forEach((file) => {
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

    setVideos([...videos, ...files])

    // Create previews
    files.forEach((file) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

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

    if (onSubmit) {
      onSubmit(reviewData)
    }

    toast.success('Recenzija uspješno poslana!')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/1000 znakova
        </p>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dodaj fotografije (opciono)
        </label>
        <div className="space-y-3">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Klikni za upload fotografija (max 5)
              </p>
            </div>
          </label>

          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dodaj video (opciono)
        </label>
        <div className="space-y-3">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Klikni za upload videa (max 2)
              </p>
            </div>
          </label>

          {videoPreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {videoPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <video
                    src={preview}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
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
        <Button type="submit" variant="primary" className="flex-1">
          Pošalji recenziju
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Odustani
          </Button>
        )}
      </div>
    </form>
  )
}
