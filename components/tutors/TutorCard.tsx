'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Star, MapPin, Clock, Video, Heart } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import useSwipeGesture from '@/hooks/useSwipeGesture'

interface TutorCardProps {
  tutor: {
    id: string
    name: string
    avatar?: string | null
    title: string
    hourlyRate: number
    averageRating: number
    totalSessions: number
    subjects: string[]
    verified: boolean
    availableOnline: boolean
    availableInPerson: boolean
    responseTime?: number
    tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'ELITE' | null
  }
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFavoriteAnimation, setShowFavoriteAnimation] = useState(false)

  const handleFavoriteToggle = async () => {
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    setShowFavoriteAnimation(true)
    setTimeout(() => setShowFavoriteAnimation(false), 300)

    try {
      if (newFavoriteState) {
        // Add to favorites
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tutorId: tutor.id }),
        })
      } else {
        // Remove from favorites
        await fetch(`/api/favorites?tutorId=${tutor.id}`, {
          method: 'DELETE',
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Revert on error
      setIsFavorite(!newFavoriteState)
    }
  }

  const { handlers, swipeOffset } = useSwipeGesture({
    onSwipeRight: () => {
      if (!isFavorite) {
        handleFavoriteToggle()
      }
    },
    threshold: 100,
  })

  const getTierBadge = () => {
    if (!tutor.tier || tutor.tier === 'BRONZE') return null

    const tierConfig = {
      SILVER: { emoji: '🥈', label: 'Silver', className: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' },
      GOLD: { emoji: '🥇', label: 'Gold', className: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' },
      PLATINUM: { emoji: '💎', label: 'Platinum', className: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white' },
      ELITE: { emoji: '⭐', label: 'Elite', className: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' },
    }

    const config = tierConfig[tutor.tier as keyof typeof tierConfig]
    if (!config) return null

    return (
      <Badge className={`${config.className} font-semibold shadow-sm`}>
        {config.emoji} {config.label}
      </Badge>
    )
  }

  return (
    <div
      {...handlers}
      className="relative"
      style={{
        transform: `translateX(${swipeOffset * 0.3}px)`,
        transition: swipeOffset === 0 ? 'transform 0.3s ease-out' : 'none',
      }}
    >
      {/* Swipe indicator */}
      {swipeOffset > 50 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-red-500 rounded-full p-3 shadow-lg animate-pulse">
          <Heart className="w-6 h-6 text-white fill-current" />
        </div>
      )}

      <Card hover className="flex flex-col h-full">
        <Link href={`/tutors/${tutor.id}`}>
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <Avatar src={tutor.avatar} name={tutor.name} size="lg" />
            {tutor.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                {tutor.name}
              </h3>
              {getTierBadge()}
            </div>
            <p className="text-sm text-gray-600 mt-1">{tutor.title}</p>

            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{tutor.averageRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({tutor.totalSessions} sesija)</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault()
              handleFavoriteToggle()
            }}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-all ${
              showFavoriteAnimation ? 'scale-125' : 'scale-100'
            } touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center`}
            aria-label={isFavorite ? 'Ukloni iz favorita' : 'Dodaj u favorite'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>
        </div>
      </Link>

      <div className="flex flex-wrap gap-2 mb-4">
        {tutor.subjects.slice(0, 3).map((subject, index) => (
          <Badge key={index} variant="info">
            {subject}
          </Badge>
        ))}
        {tutor.subjects.length > 3 && (
          <Badge variant="default">+{tutor.subjects.length - 3}</Badge>
        )}
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
        {tutor.availableOnline && (
          <div className="flex items-center space-x-1">
            <Video className="w-4 h-4" />
            <span>Online</span>
          </div>
        )}
        {tutor.availableInPerson && (
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>Uživo</span>
          </div>
        )}
        {tutor.responseTime && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{tutor.responseTime}min</span>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(tutor.hourlyRate)}
          </span>
          <span className="text-sm text-gray-500">/sat</span>
        </div>
        <Link href={`/tutors/${tutor.id}`}>
          <Button variant="primary" size="sm">
            Pogledaj profil
          </Button>
        </Link>
      </div>
    </Card>
    </div>
  )
}
