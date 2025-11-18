'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, TrendingUp, User, BookOpen, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Suggestion {
  id: string
  name: string
  type: 'tutor' | 'subject'
  avatar?: string
  title?: string
  rating?: number
  subjects?: string[]
  tier?: string
  category?: string
  tutorCount?: number
}

interface SearchAutocompleteProps {
  onSelect?: (value: string, type?: string) => void
  placeholder?: string
  className?: string
}

export default function SearchAutocomplete({
  onSelect,
  placeholder = 'Pretraži instruktore ili predmete...',
  className = '',
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{
    tutors: Suggestion[]
    subjects: Suggestion[]
    type: 'search' | 'popular'
  }>({ tutors: [], subjects: [], type: 'popular' })
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 0) {
        fetchSuggestions()
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/search/suggestions?query=${encodeURIComponent(query)}&limit=5`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }

      const data = await response.json()
      setSuggestions(data)
      setShowDropdown(true)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (suggestion: Suggestion) => {
    if (suggestion.type === 'tutor') {
      router.push(`/tutors/${suggestion.id}`)
    } else if (suggestion.type === 'subject') {
      if (onSelect) {
        onSelect(suggestion.name, 'subject')
      }
      setQuery(suggestion.name)
    }
    setShowDropdown(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSelect && query) {
      onSelect(query, 'query')
    }
    setShowDropdown(false)
  }

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'ELITE':
        return 'text-pink-600'
      case 'PLATINUM':
        return 'text-purple-600'
      case 'GOLD':
        return 'text-yellow-600'
      case 'SILVER':
        return 'text-gray-500'
      default:
        return 'text-gray-400'
    }
  }

  const hasSuggestions = suggestions.tutors.length > 0 || suggestions.subjects.length > 0

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </form>

      {/* Dropdown */}
      {showDropdown && hasSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto"
        >
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 text-sm text-gray-500">
            {suggestions.type === 'popular' ? (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>Popularno</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Rezultati pretrage</span>
              </>
            )}
          </div>

          {/* Tutors */}
          {suggestions.tutors.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">
                Instruktori
              </div>
              {suggestions.tutors.map((tutor) => (
                <button
                  key={tutor.id}
                  onClick={() => handleSelect(tutor)}
                  className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {tutor.avatar ? (
                      <img
                        src={tutor.avatar}
                        alt={tutor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {tutor.name}
                      </span>
                      {tutor.tier && tutor.tier !== 'BRONZE' && (
                        <span className={`text-xs ${getTierColor(tutor.tier)}`}>
                          {tutor.tier}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {tutor.title || tutor.subjects?.join(', ')}
                    </p>
                  </div>

                  {/* Rating */}
                  {tutor.rating && tutor.rating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{tutor.rating.toFixed(1)}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Subjects */}
          {suggestions.subjects.length > 0 && (
            <div className="py-2 border-t border-gray-100">
              <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">
                Predmeti
              </div>
              {suggestions.subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSelect(subject)}
                  className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {subject.name}
                    </div>
                    <p className="text-sm text-gray-500">
                      {subject.category} • {subject.tutorCount} instruktor
                      {subject.tutorCount !== 1 && 'a'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
