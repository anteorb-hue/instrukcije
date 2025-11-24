'use client'

import React, { useState, useEffect } from 'react'
import TutorCard from '@/components/tutors/TutorCard'
import SearchFilters from '@/components/search/SearchFilters'
import { Loader2 } from 'lucide-react'

export default function TutorsPage() {
  const [loading, setLoading] = useState(true)
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [, setInitialLoad] = useState(true)

  // Load all tutors on mount
  useEffect(() => {
    fetchTutors({})
  }, [])

  const fetchTutors = async (filters: Record<string, unknown>) => {
    try {
      setLoading(true)

      // Build query params from filters
      const params = new URLSearchParams()
      if (filters.query) params.append('query', filters.query)
      if (filters.subject) params.append('subject', filters.subject)
      if (filters.educationLevel) params.append('educationLevel', filters.educationLevel)
      if (filters.priceMin) params.append('priceMin', filters.priceMin.toString())
      if (filters.priceMax) params.append('priceMax', filters.priceMax.toString())
      if (filters.rating) params.append('rating', filters.rating.toString())
      if (filters.tier) params.append('tier', filters.tier)
      if (filters.city) params.append('city', filters.city)
      if (filters.availableDate) params.append('availableDate', filters.availableDate)
      if (filters.availableTime) params.append('availableTime', filters.availableTime)

      const response = await fetch(`/api/tutors?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch tutors')
      }

      const data = await response.json()

      // Transform API response to match TutorCard interface
      const transformedTutors = data.map((tutor: Record<string, unknown>) => ({
        id: tutor.id,
        name: tutor.name,
        avatar: tutor.avatar,
        title: tutor.tutorProfile?.title || tutor.bio || 'Instruktor',
        hourlyRate: tutor.tutorProfile?.hourlyRate || 0,
        averageRating: tutor.tutorProfile?.averageRating || 0,
        totalSessions: tutor.tutorProfile?.totalLessons || 0,
        subjects: (tutor.tutorProfile as Record<string, unknown>)?.subjects?.map((s: Record<string, unknown>) => (s.subject as Record<string, unknown>).name) || [],
        verified: tutor.tutorProfile?.verified || false,
        availableOnline: true, // Could add this field to DB if needed
        availableInPerson: true, // Could add this field to DB if needed
        responseTime: 20, // Could calculate from messages if needed
        tier: tutor.userPoints?.currentTier || null,
      }))

      setTutors(transformedTutors)
    } catch (error) {
      console.error('Error fetching tutors:', error)
      setTutors([])
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  const handleSearch = async (filters: Record<string, unknown>) => {
    await fetchTutors(filters)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Pronađi svog idealnog instruktora
          </h1>
          <p className="text-lg text-gray-600">
            {tutors.length} verificiranih instruktora spremnih pomoći vam
          </p>
        </div>

        <div className="mb-8">
          <SearchFilters onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}

        {!loading && tutors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">
              Nema pronađenih instruktora. Pokušajte s drugim filterima.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
