'use client'

import { useState, useEffect } from 'react'
import { debounce } from '@/lib/performance'

interface AutocompleteResult {
  type: 'tutor' | 'subject' | 'specialization'
  value: string
  count?: number
}

export function useSearchAutocomplete(query: string, delay = 300) {
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    const debouncedSearch = debounce(() => {
      setIsLoading(true)

      // Mock autocomplete - in production, call API
      const mockSuggestions: AutocompleteResult[] = [
        { type: 'subject', value: 'Matematika', count: 156 },
        { type: 'subject', value: 'Fizika', count: 89 },
        { type: 'tutor', value: 'Ana Horvat' },
        { type: 'tutor', value: 'Marko Novak' },
        { type: 'specialization', value: 'Matura priprema', count: 78 },
        { type: 'specialization', value: 'Programiranje u Pythonu', count: 45 },
      ].filter(s =>
        s.value.toLowerCase().includes(query.toLowerCase())
      )

      setTimeout(() => {
        setSuggestions(mockSuggestions)
        setIsLoading(false)
      }, 200)
    }, delay)

    debouncedSearch()
  }, [query, delay])

  return { suggestions, isLoading }
}

// Saved searches management
export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<string[]>([])

  useEffect(() => {
    // Load from localStorage with safe parsing
    const saved = localStorage.getItem('savedSearches')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)

        // Validate that parsed data is an array
        if (!Array.isArray(parsed)) {
          console.warn('Invalid savedSearches format, resetting')
          localStorage.removeItem('savedSearches')
          return
        }

        // Sanitize array items - only allow strings, max length
        const sanitized = parsed
          .filter((item) => typeof item === 'string')
          .map((item) => item.trim().slice(0, 200)) // Limit string length
          .filter((item) => item.length > 0)
          .slice(0, 10) // Max 10 items

        setSavedSearches(sanitized)

        // Update localStorage with sanitized data if different
        if (JSON.stringify(parsed) !== JSON.stringify(sanitized)) {
          localStorage.setItem('savedSearches', JSON.stringify(sanitized))
        }
      } catch (error) {
        console.error('Error parsing savedSearches:', error)
        localStorage.removeItem('savedSearches')
      }
    }
  }, [])

  const saveSearch = (query: string) => {
    // Sanitize input before saving
    const sanitizedQuery = query.trim().slice(0, 200)

    if (!sanitizedQuery) {
      return // Don't save empty strings
    }

    const updated = [sanitizedQuery, ...savedSearches.filter(s => s !== sanitizedQuery)].slice(0, 10)
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
  }

  const removeSearch = (query: string) => {
    const updated = savedSearches.filter(s => s !== query)
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
  }

  const clearAll = () => {
    setSavedSearches([])
    localStorage.removeItem('savedSearches')
  }

  return { savedSearches, saveSearch, removeSearch, clearAll }
}
