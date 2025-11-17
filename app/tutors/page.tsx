'use client'

import React, { useState } from 'react'
import TutorCard from '@/components/tutors/TutorCard'
import SearchFilters from '@/components/search/SearchFilters'
import { Loader2 } from 'lucide-react'

// All tutors data
const ALL_TUTORS = [
  {
    id: '1',
    name: 'Ana Horvat',
    avatar: null,
    title: 'Magistar matematike sa 10+ godina iskustva',
    hourlyRate: 25,
    averageRating: 4.9,
    totalSessions: 234,
    subjects: ['Matematika', 'Fizika', 'Statistika'],
    verified: true,
    availableOnline: true,
    availableInPerson: true,
    responseTime: 15,
  },
  {
    id: '2',
    name: 'Marko Novak',
    avatar: null,
    title: 'Native speaker, Cambridge certificiran',
    hourlyRate: 30,
    averageRating: 4.8,
    totalSessions: 189,
    subjects: ['Engleski jezik', 'Business English'],
    verified: true,
    availableOnline: true,
    availableInPerson: false,
    responseTime: 20,
  },
  {
    id: '3',
    name: 'Petra Kovačić',
    avatar: null,
    title: 'Full-stack developer i mentor',
    hourlyRate: 40,
    averageRating: 5.0,
    totalSessions: 156,
    subjects: ['Programiranje', 'Web Development', 'JavaScript', 'React'],
    verified: true,
    availableOnline: true,
    availableInPerson: true,
    responseTime: 10,
  },
  {
    id: '4',
    name: 'Ivan Babić',
    avatar: null,
    title: 'Profesor kemije sa 15 godina iskustva',
    hourlyRate: 28,
    averageRating: 4.7,
    totalSessions: 312,
    subjects: ['Kemija', 'Biokemija', 'Organska kemija'],
    verified: true,
    availableOnline: true,
    availableInPerson: true,
    responseTime: 30,
  },
  {
    id: '5',
    name: 'Lucija Marić',
    avatar: null,
    title: 'Diplomirani ekonomist',
    hourlyRate: 22,
    averageRating: 4.8,
    totalSessions: 98,
    subjects: ['Ekonomija', 'Računovodstvo', 'Poslovna ekonomija'],
    verified: true,
    availableOnline: true,
    availableInPerson: false,
    responseTime: 25,
  },
  {
    id: '6',
    name: 'Tomislav Jurić',
    avatar: null,
    title: 'Certificirani instruktor njemačkog jezika',
    hourlyRate: 26,
    averageRating: 4.9,
    totalSessions: 178,
    subjects: ['Njemački jezik', 'Poslovno njemački'],
    verified: true,
    availableOnline: true,
    availableInPerson: true,
    responseTime: 15,
  },
]

export default function TutorsPage() {
  const [loading, setLoading] = useState(false)
  const [tutors, setTutors] = useState(ALL_TUTORS)

  const handleSearch = async (filters: any) => {
    setLoading(true)

    // Simulate API delay
    setTimeout(() => {
      let filtered = [...ALL_TUTORS]

      // Filter by search query (name, title, subjects)
      if (filters.query) {
        const query = filters.query.toLowerCase()
        filtered = filtered.filter(
          (tutor) =>
            tutor.name.toLowerCase().includes(query) ||
            tutor.title.toLowerCase().includes(query) ||
            tutor.subjects.some((subject) => subject.toLowerCase().includes(query))
        )
      }

      // Filter by subject
      if (filters.subject) {
        filtered = filtered.filter((tutor) =>
          tutor.subjects.includes(filters.subject)
        )
      }

      // Filter by rating
      if (filters.rating) {
        const minRating = parseFloat(filters.rating)
        filtered = filtered.filter((tutor) => tutor.averageRating >= minRating)
      }

      // Filter by price range
      if (filters.priceMin) {
        const minPrice = parseFloat(filters.priceMin)
        filtered = filtered.filter((tutor) => tutor.hourlyRate >= minPrice)
      }
      if (filters.priceMax) {
        const maxPrice = parseFloat(filters.priceMax)
        filtered = filtered.filter((tutor) => tutor.hourlyRate <= maxPrice)
      }

      // Filter by availability
      if (filters.availability === 'online') {
        filtered = filtered.filter((tutor) => tutor.availableOnline)
      } else if (filters.availability === 'in-person') {
        filtered = filtered.filter((tutor) => tutor.availableInPerson)
      }

      setTutors(filtered)
      setLoading(false)
    }, 500)
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
