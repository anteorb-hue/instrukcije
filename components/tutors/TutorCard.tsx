'use client'

import React from 'react'
import Link from 'next/link'
import { Star, MapPin, Clock, Video, Heart } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

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
  }
}

export default function TutorCard({ tutor }: TutorCardProps) {
  return (
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
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {tutor.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{tutor.title}</p>

            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{tutor.averageRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({tutor.totalSessions} sesija)</span>
              </div>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
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
  )
}
