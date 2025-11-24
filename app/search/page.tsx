'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import {
  Search,
  X,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  BookOpen,
  Users,
  Award,
  SlidersHorizontal,
  CheckCircle,
  Video,
  Home,
} from 'lucide-react'

// Mock data interfaces
interface Tutor {
  id: string
  name: string
  avatar?: string
  title: string
  subjects: string[]
  rating: number
  totalReviews: number
  totalStudents: number
  hourlyRate: number
  location: string
  languages: string[]
  experience: number
  availability: {
    online: boolean
    inPerson: boolean
    weekdays: boolean
    weekends: boolean
  }
  education: string
  verified: boolean
  responseTime: string
  completedLessons: number
  specializations: string[]
}

interface FilterState {
  subjects: string[]
  levels: string[]
  priceRange: [number, number]
  rating: number
  availability: string[]
  languages: string[]
  verified: boolean
  location: string
}

export default function AdvancedSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(true)
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price-low' | 'price-high' | 'experience'>('relevance')

  const [filters, setFilters] = useState<FilterState>({
    subjects: [],
    levels: [],
    priceRange: [0, 100],
    rating: 0,
    availability: [],
    languages: [],
    verified: false,
    location: '',
  })

  // Available filter options
  const subjects = [
    'Matematika',
    'Fizika',
    'Kemija',
    'Biologija',
    'Engleski jezik',
    'Njemački jezik',
    'Francuski jezik',
    'Programiranje',
    'Web Development',
    'Python',
    'JavaScript',
    'Historia',
    'Geografija',
    'Ekonomija',
  ]

  const _levels = [
    'Osnovna škola',
    'Srednja škola',
    'Fakultet',
    'Početnici',
    'Napredni',
    'Profesionalni',
  ]

  const languages = [
    'Hrvatski',
    'Engleski',
    'Njemački',
    'Talijanski',
    'Francuski',
    'Španjolski',
  ]

  const availabilityOptions = [
    { value: 'online', label: 'Online', icon: Video },
    { value: 'inPerson', label: 'Uživo', icon: Home },
    { value: 'weekdays', label: 'Radni dani', icon: Calendar },
    { value: 'weekends', label: 'Vikendi', icon: Calendar },
  ]

  // Mock tutors data
  const allTutors: Tutor[] = [
    {
      id: '1',
      name: 'Ana Horvat',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      title: 'Magistar matematike s 10+ godina iskustva',
      subjects: ['Matematika', 'Fizika'],
      rating: 4.9,
      totalReviews: 156,
      totalStudents: 342,
      hourlyRate: 35,
      location: 'Zagreb',
      languages: ['Hrvatski', 'Engleski'],
      experience: 10,
      availability: {
        online: true,
        inPerson: true,
        weekdays: true,
        weekends: true,
      },
      education: 'Magistar matematike, PMF Zagreb',
      verified: true,
      responseTime: '< 1h',
      completedLessons: 1248,
      specializations: ['Matura priprema', 'Fakultetska matematika', 'Dodatna nastava'],
    },
    {
      id: '2',
      name: 'Marko Novak',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marko',
      title: 'Native English speaker s TEFL certifikatom',
      subjects: ['Engleski jezik'],
      rating: 4.8,
      totalReviews: 203,
      totalStudents: 456,
      hourlyRate: 30,
      location: 'Split',
      languages: ['Engleski', 'Hrvatski'],
      experience: 8,
      availability: {
        online: true,
        inPerson: false,
        weekdays: true,
        weekends: false,
      },
      education: 'BA in English Literature, TEFL Certificate',
      verified: true,
      responseTime: '< 2h',
      completedLessons: 987,
      specializations: ['Business English', 'Konverzacija', 'IELTS priprema'],
    },
    {
      id: '3',
      name: 'Petra Kovač',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petra',
      title: 'Web developer i instruktor programiranja',
      subjects: ['Programiranje', 'Web Development', 'JavaScript', 'Python'],
      rating: 4.9,
      totalReviews: 142,
      totalStudents: 267,
      hourlyRate: 45,
      location: 'Zagreb',
      languages: ['Hrvatski', 'Engleski'],
      experience: 7,
      availability: {
        online: true,
        inPerson: true,
        weekdays: false,
        weekends: true,
      },
      education: 'Dipl. ing. računarstva, FER Zagreb',
      verified: true,
      responseTime: '< 30min',
      completedLessons: 756,
      specializations: ['React', 'Node.js', 'Full-stack development'],
    },
    {
      id: '4',
      name: 'Ivan Babić',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
      title: 'Doktor kemijskih znanosti',
      subjects: ['Kemija', 'Biologija'],
      rating: 4.7,
      totalReviews: 98,
      totalStudents: 189,
      hourlyRate: 38,
      location: 'Rijeka',
      languages: ['Hrvatski', 'Engleski', 'Njemački'],
      experience: 12,
      availability: {
        online: true,
        inPerson: true,
        weekdays: true,
        weekends: false,
      },
      education: 'PhD in Chemistry, University of Zagreb',
      verified: true,
      responseTime: '< 3h',
      completedLessons: 623,
      specializations: ['Organska kemija', 'Anorganska kemija', 'Matura priprema'],
    },
    {
      id: '5',
      name: 'Lucija Marić',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucija',
      title: 'Profesorica njemačkog jezika',
      subjects: ['Njemački jezik'],
      rating: 4.8,
      totalReviews: 167,
      totalStudents: 298,
      hourlyRate: 32,
      location: 'Osijek',
      languages: ['Hrvatski', 'Njemački', 'Engleski'],
      experience: 9,
      availability: {
        online: true,
        inPerson: true,
        weekdays: true,
        weekends: true,
      },
      education: 'Magistar njemačkog jezika i književnosti',
      verified: true,
      responseTime: '< 1h',
      completedLessons: 891,
      specializations: ['Goethe Institut priprema', 'Konverzacija', 'Poslovna njemačka'],
    },
    {
      id: '6',
      name: 'Tomislav Jurić',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tomislav',
      title: 'Fizičar i istraživač',
      subjects: ['Fizika', 'Matematika'],
      rating: 4.6,
      totalReviews: 74,
      totalStudents: 134,
      hourlyRate: 33,
      location: 'Zagreb',
      languages: ['Hrvatski', 'Engleski'],
      experience: 5,
      availability: {
        online: true,
        inPerson: false,
        weekdays: true,
        weekends: true,
      },
      education: 'Magistar fizike, PMF Zagreb',
      verified: false,
      responseTime: '< 4h',
      completedLessons: 412,
      specializations: ['Mehanika', 'Elektromagnetizam', 'Kvantna fizika'],
    },
  ]

  // Filter tutors based on filters and search
  const filteredTutors = allTutors.filter((tutor) => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        tutor.name.toLowerCase().includes(query) ||
        tutor.title.toLowerCase().includes(query) ||
        tutor.subjects.some((s) => s.toLowerCase().includes(query)) ||
        tutor.specializations.some((s) => s.toLowerCase().includes(query))
      if (!matchesSearch) return false
    }

    // Subject filter
    if (filters.subjects.length > 0) {
      const hasSubject = tutor.subjects.some((s) => filters.subjects.includes(s))
      if (!hasSubject) return false
    }

    // Price range filter
    if (tutor.hourlyRate < filters.priceRange[0] || tutor.hourlyRate > filters.priceRange[1]) {
      return false
    }

    // Rating filter
    if (tutor.rating < filters.rating) return false

    // Verified filter
    if (filters.verified && !tutor.verified) return false

    // Availability filters
    if (filters.availability.length > 0) {
      const hasAvailability = filters.availability.every((avail) => {
        if (avail === 'online') return tutor.availability.online
        if (avail === 'inPerson') return tutor.availability.inPerson
        if (avail === 'weekdays') return tutor.availability.weekdays
        if (avail === 'weekends') return tutor.availability.weekends
        return true
      })
      if (!hasAvailability) return false
    }

    // Language filter
    if (filters.languages.length > 0) {
      const hasLanguage = tutor.languages.some((lang) => filters.languages.includes(lang))
      if (!hasLanguage) return false
    }

    return true
  })

  // Sort tutors
  const sortedTutors = [...filteredTutors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'price-low':
        return a.hourlyRate - b.hourlyRate
      case 'price-high':
        return b.hourlyRate - a.hourlyRate
      case 'experience':
        return b.experience - a.experience
      default:
        return 0 // relevance (default order)
    }
  })

  const toggleSubjectFilter = (subject: string) => {
    setFilters((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const _toggleLevelFilter = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter((l) => l !== level)
        : [...prev.levels, level],
    }))
  }

  const toggleLanguageFilter = (language: string) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }))
  }

  const toggleAvailabilityFilter = (availability: string) => {
    setFilters((prev) => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter((a) => a !== availability)
        : [...prev.availability, availability],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      subjects: [],
      levels: [],
      priceRange: [0, 100],
      rating: 0,
      availability: [],
      languages: [],
      verified: false,
      location: '',
    })
    setSearchQuery('')
  }

  const activeFiltersCount =
    filters.subjects.length +
    filters.levels.length +
    filters.availability.length +
    filters.languages.length +
    (filters.verified ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pretraži instruktore</h1>
              <p className="mt-1 text-sm text-gray-600">
                Pronađi savršenog instruktora za svoje potrebe
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Pretraži po imenu, predmetu ili specijalnosti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filteri
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="ml-1 bg-white text-primary-600">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Aktivni filteri:</span>
                {filters.subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSubjectFilter(subject)}
                  >
                    {subject}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {filters.languages.map((lang) => (
                  <Badge
                    key={lang}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleLanguageFilter(lang)}
                  >
                    {lang}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {filters.availability.map((avail) => (
                  <Badge
                    key={avail}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleAvailabilityFilter(avail)}
                  >
                    {availabilityOptions.find((a) => a.value === avail)?.label}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {filters.verified && (
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setFilters({ ...filters, verified: false })}
                  >
                    Verificirani
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.rating > 0 && (
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setFilters({ ...filters, rating: 0 })}
                  >
                    {filters.rating}+ zvjezdica
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Očisti sve
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <Card className="p-6 sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Filteri</h2>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Očisti sve
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Subject Filter */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Predmet</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {subjects.map((subject) => (
                        <label
                          key={subject}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={filters.subjects.includes(subject)}
                            onChange={() => toggleSubjectFilter(subject)}
                            className="rounded text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Cijena po satu</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{filters.priceRange[0]} EUR</span>
                        <span className="text-gray-600">{filters.priceRange[1]} EUR</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            priceRange: [0, parseInt(e.target.value)],
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Minimalna ocjena</h3>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === rating}
                            onChange={() => setFilters({ ...filters, rating })}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-700">{rating}+</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Dostupnost</h3>
                    <div className="space-y-2">
                      {availabilityOptions.map(({ value, label, icon: Icon }) => (
                        <label
                          key={value}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={filters.availability.includes(value)}
                            onChange={() => toggleAvailabilityFilter(value)}
                            className="rounded text-primary-600 focus:ring-primary-500"
                          />
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Jezik predavanja</h3>
                    <div className="space-y-2">
                      {languages.map((language) => (
                        <label
                          key={language}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={filters.languages.includes(language)}
                            onChange={() => toggleLanguageFilter(language)}
                            className="rounded text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{language}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Verified Filter */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.verified}
                        onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Samo verificirani instruktori
                      </span>
                    </label>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {sortedTutors.length} {sortedTutors.length === 1 ? 'instruktor' : 'instruktora'}
                </p>
                <p className="text-sm text-gray-600">
                  Prikazano {sortedTutors.length} od {allTutors.length} instruktora
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sortiraj:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="relevance">Relevantnost</option>
                  <option value="rating">Najviša ocjena</option>
                  <option value="price-low">Najniža cijena</option>
                  <option value="price-high">Najviša cijena</option>
                  <option value="experience">Najviše iskustva</option>
                </select>
              </div>
            </div>

            {/* Tutor Cards */}
            {sortedTutors.length === 0 ? (
              <Card className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nema rezultata pretrage
                </h3>
                <p className="text-gray-600 mb-4">
                  Pokušajte promijeniti filtere ili pretragu
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Očisti sve filtere
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {sortedTutors.map((tutor) => (
                  <Card
                    key={tutor.id}
                    className="p-6 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <Avatar className="h-24 w-24">
                          {tutor.avatar && <img src={tutor.avatar} alt={tutor.name} />}
                        </Avatar>
                        {tutor.verified && (
                          <div className="flex items-center justify-center mt-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-xs text-green-600 font-medium">Verificiran</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{tutor.title}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary-600">
                              {tutor.hourlyRate} EUR
                            </p>
                            <p className="text-sm text-gray-600">po satu</p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold text-gray-900">{tutor.rating}</span>
                            <span className="text-sm text-gray-600">
                              ({tutor.totalReviews} recenzija)
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{tutor.totalStudents} učenika</span>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <BookOpen className="h-4 w-4" />
                            <span>{tutor.completedLessons} lekcija</span>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Award className="h-4 w-4" />
                            <span>{tutor.experience} god. iskustva</span>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>Odgovara {tutor.responseTime}</span>
                          </div>
                        </div>

                        {/* Location & Languages */}
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{tutor.location}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {tutor.availability.online && (
                              <Badge variant="outline" className="text-xs">
                                <Video className="h-3 w-3 mr-1" />
                                Online
                              </Badge>
                            )}
                            {tutor.availability.inPerson && (
                              <Badge variant="outline" className="text-xs">
                                <Home className="h-3 w-3 mr-1" />
                                Uživo
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-1">
                            {tutor.languages.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Subjects */}
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2">
                            {tutor.subjects.map((subject) => (
                              <Badge key={subject} className="bg-primary-100 text-primary-700">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Specializations */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Specijalnosti:</span>{' '}
                            {tutor.specializations.join(' • ')}
                          </p>
                        </div>

                        {/* Education */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Obrazovanje:</span> {tutor.education}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button className="flex-1">Pošalji poruku</Button>
                          <Button variant="outline">Pogledaj profil</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
