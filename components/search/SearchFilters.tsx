'use client'

import React, { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface SearchFiltersProps {
  onSearch: (filters: any) => void
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    query: '',
    subject: '',
    educationLevel: '',
    priceMin: '',
    priceMax: '',
    rating: '',
    availability: '',
    videoProvider: '',
    tier: '',
    city: '',
    availableDate: '',
    availableTime: '',
  })

  const subjects = [
    'Matematika',
    'Fizika',
    'Kemija',
    'Hrvatski jezik',
    'Engleski jezik',
    'Njemački jezik',
    'Informatika',
    'Programiranje',
    'Ekonomija',
    'Povijest',
  ]

  const educationLevels = [
    { value: 'OSNOVNA_SKOLA', label: 'Osnovna škola' },
    { value: 'SREDNJA_SKOLA', label: 'Srednja škola' },
    { value: 'FAKULTET', label: 'Fakultet' },
    { value: 'OSTALO', label: 'Ostalo' },
  ]

  const cities = [
    'Zagreb',
    'Split',
    'Rijeka',
    'Osijek',
    'Zadar',
    'Pula',
    'Slavonski Brod',
    'Karlovac',
    'Varaždin',
    'Šibenik',
    'Sisak',
    'Dubrovnik',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters = {
      query: '',
      subject: '',
      educationLevel: '',
      priceMin: '',
      priceMax: '',
      rating: '',
      availability: '',
      videoProvider: '',
      tier: '',
      city: '',
      availableDate: '',
      availableTime: '',
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit}>
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Pretraži instruktore, predmete..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button type="submit" variant="primary">
            <Search className="w-5 h-5 mr-2" />
            Pretraži
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filteri
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 animate-slide-up">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Predmet
              </label>
              <select
                className="input-field"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              >
                <option value="">Svi predmeti</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razina obrazovanja
              </label>
              <select
                className="input-field"
                value={filters.educationLevel}
                onChange={(e) => setFilters({ ...filters, educationLevel: e.target.value })}
              >
                <option value="">Sve razine</option>
                {educationLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimalna ocjena
              </label>
              <select
                className="input-field"
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              >
                <option value="">Sve ocjene</option>
                <option value="4">4+ zvjezdice</option>
                <option value="4.5">4.5+ zvjezdice</option>
                <option value="4.8">4.8+ zvjezdice</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cijena (EUR/sat)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="input-field"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="input-field"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dostupnost
              </label>
              <select
                className="input-field"
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
              >
                <option value="">Sve</option>
                <option value="online">Online</option>
                <option value="in-person">Uživo</option>
              </select>
            </div>

            {/* Video Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video platforma
              </label>
              <select
                className="input-field"
                value={filters.videoProvider}
                onChange={(e) => setFilters({ ...filters, videoProvider: e.target.value })}
              >
                <option value="">Sve platforme</option>
                <option value="ZOOM">Zoom</option>
                <option value="GOOGLE_MEET">Google Meet</option>
                <option value="MICROSOFT_TEAMS">Microsoft Teams</option>
              </select>
            </div>

            {/* Tier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tier instruktora
              </label>
              <select
                className="input-field"
                value={filters.tier}
                onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
              >
                <option value="">Svi tier-ovi</option>
                <option value="SILVER">🥈 Silver</option>
                <option value="GOLD">🥇 Gold</option>
                <option value="PLATINUM">💎 Platinum</option>
                <option value="ELITE">⭐ Elite</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grad
              </label>
              <select
                className="input-field"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              >
                <option value="">Svi gradovi</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dostupnost (datum)
              </label>
              <input
                type="date"
                className="input-field"
                value={filters.availableDate}
                onChange={(e) => setFilters({ ...filters, availableDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dostupnost (vrijeme)
              </label>
              <input
                type="time"
                className="input-field"
                value={filters.availableTime}
                onChange={(e) => setFilters({ ...filters, availableTime: e.target.value })}
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="w-full"
              >
                <X className="w-5 h-5 mr-2" />
                Resetiraj filtere
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
