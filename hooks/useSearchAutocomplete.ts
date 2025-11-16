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
    // Load from localStorage
    const saved = localStorage.getItem('savedSearches')
    if (saved) {
      setSavedSearches(JSON.parse(saved))
    }
  }, [])

  const saveSearch = (query: string) => {
    const updated = [query, ...savedSearches.filter(s => s !== query)].slice(0, 10)
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
