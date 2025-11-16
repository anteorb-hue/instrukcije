'use client'

import React, { useState } from 'react'
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  MessageSquare,
  MoreVertical,
  Flag,
  Share2,
  Image as ImageIcon,
  Video,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import StarRating from './StarRating'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Review {
  id: string
  reviewer: {
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  communication?: number
  expertise?: number
  punctuality?: number
  photos?: string[]
  videos?: string[]
  createdAt: Date
  verifiedPurchase: boolean
  helpful: number
  notHelpful: number
  tutorResponse?: {
    text: string
    createdAt: Date
  }
  userVote?: 'helpful' | 'not_helpful' | null
}

interface ReviewCardProps {
  review: Review
  onVote?: (reviewId: string, vote: 'helpful' | 'not_helpful') => void
  onReport?: (reviewId: string) => void
  onShare?: (reviewId: string) => void
  showTutorResponse?: boolean
}

export default function ReviewCard({
  review,
  onVote,
  onReport,
  onShare,
  showTutorResponse = true,
}: ReviewCardProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [showAllVideos, setShowAllVideos] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const handleVote = (vote: 'helpful' | 'not_helpful') => {
    if (onVote) {
      onVote(review.id, vote)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('hr-HR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const photosToShow = showAllPhotos ? review.photos : review.photos?.slice(0, 3)
  const videosToShow = showAllVideos ? review.videos : review.videos?.slice(0, 1)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {review.reviewer.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">{review.reviewer.name}</h4>
              {review.verifiedPurchase && (
                <Badge variant="success" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verificirano
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <StarRating rating={review.rating} readonly size="sm" />
              <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <button
                onClick={() => {
                  if (onShare) onShare(review.id)
                  setShowMenu(false)
                }}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left"
              >
                <Share2 className="w-4 h-4" />
                <span>Podijeli</span>
              </button>
              <button
                onClick={() => {
                  if (onReport) onReport(review.id)
                  setShowMenu(false)
                }}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left text-red-600"
              >
                <Flag className="w-4 h-4" />
                <span>Prijavi</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Ratings */}
      {(review.communication || review.expertise || review.punctuality) && (
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          {review.communication && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Komunikacija</p>
              <StarRating rating={review.communication} readonly size="sm" />
            </div>
          )}
          {review.expertise && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Stručnost</p>
              <StarRating rating={review.expertise} readonly size="sm" />
            </div>
          )}
          {review.punctuality && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Točnost</p>
              <StarRating rating={review.punctuality} readonly size="sm" />
            </div>
          )}
        </div>
      )}

      {/* Comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {photosToShow?.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Review photo ${index + 1}`}
                onClick={() => setSelectedPhoto(photo)}
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
            ))}
          </div>
          {review.photos.length > 3 && !showAllPhotos && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <ImageIcon className="w-4 h-4 mr-1" />
              Prikaži sve fotografije ({review.photos.length})
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          )}
          {showAllPhotos && (
            <button
              onClick={() => setShowAllPhotos(false)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <ChevronUp className="w-4 h-4 mr-1" />
              Prikaži manje
            </button>
          )}
        </div>
      )}

      {/* Videos */}
      {review.videos && review.videos.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 mb-2">
            {videosToShow?.map((video, index) => (
              <video
                key={index}
                src={video}
                controls
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
          {review.videos.length > 1 && !showAllVideos && (
            <button
              onClick={() => setShowAllVideos(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <Video className="w-4 h-4 mr-1" />
              Prikaži sve videe ({review.videos.length})
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      )}

      {/* Helpful Votes */}
      <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">Je li ova recenzija korisna?</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleVote('helpful')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
              review.userVote === 'helpful'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium">{review.helpful}</span>
          </button>
          <button
            onClick={() => handleVote('not_helpful')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
              review.userVote === 'not_helpful'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="text-sm font-medium">{review.notHelpful}</span>
          </button>
        </div>
      </div>

      {/* Tutor Response */}
      {showTutorResponse && review.tutorResponse && (
        <div className="mt-4 pl-4 border-l-4 border-primary-500 bg-primary-50 p-4 rounded-r-lg">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-900">
              Odgovor instruktora
            </span>
            <span className="text-xs text-primary-700">
              {formatDate(review.tutorResponse.createdAt)}
            </span>
          </div>
          <p className="text-sm text-primary-900 leading-relaxed">
            {review.tutorResponse.text}
          </p>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
