'use client'

import React, { useState } from 'react'
import {
  Star,
  TrendingUp,
  Filter,
  ChevronDown,
  CheckCircle,
  Image as ImageIcon,
  Video,
  MessageSquare,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/reviews/StarRating'
import ReviewCard from '@/components/reviews/ReviewCard'

interface TutorReviewsPageProps {
  params: { tutorId: string }
}

export default function TutorReviewsPage({ params }: TutorReviewsPageProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating_high' | 'rating_low'>(
    'recent'
  )
  const [filterRating, setFilterRating] = useState<number | 'all'>('all')
  const [filterVerified, setFilterVerified] = useState(false)
  const [filterWithMedia, setFilterWithMedia] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Mock data
  const tutorData = {
    id: params.tutorId,
    name: 'Ana Horvat',
    avatar: '',
    averageRating: 4.8,
    totalReviews: 156,
    ratingBreakdown: {
      5: 120,
      4: 28,
      3: 5,
      2: 2,
      1: 1,
    },
  }

  const allReviews = [
    {
      id: '1',
      reviewer: {
        name: 'Marko Marić',
      },
      rating: 5,
      communication: 5,
      expertise: 5,
      punctuality: 5,
      comment:
        'Odličan instruktor! Ana je vrlo strpljiva i sve jasno objašnjava. Moj sin je nakon samo mjesec dana popravio ocjenu iz matematike. Toplo preporučujem!',
      photos: [
        'https://via.placeholder.com/300',
        'https://via.placeholder.com/300',
        'https://via.placeholder.com/300',
      ],
      createdAt: new Date('2025-01-15'),
      verifiedPurchase: true,
      helpful: 24,
      notHelpful: 1,
      tutorResponse: {
        text: 'Hvala vam puno na lijepim riječima! Bilo mi je zadovoljstvo raditi s vašim sinom. Vidim veliki napredak i nadam se našoj daljnjoj suradnji!',
        createdAt: new Date('2025-01-16'),
      },
      userVote: null,
    },
    {
      id: '2',
      reviewer: {
        name: 'Petra Kovačić',
      },
      rating: 5,
      communication: 5,
      expertise: 5,
      punctuality: 4,
      comment:
        'Profesionalan pristup i odlična priprema za maturu. Ana mi je pomogla savladati derivacije i integrale koje nisam mogla razumjeti na nastavi. Sve preporučujem!',
      videos: ['https://via.placeholder.com/400x300'],
      createdAt: new Date('2025-01-12'),
      verifiedPurchase: true,
      helpful: 18,
      notHelpful: 0,
      userVote: null,
    },
    {
      id: '3',
      reviewer: {
        name: 'Ivan Petrović',
      },
      rating: 4,
      communication: 4,
      expertise: 5,
      punctuality: 4,
      comment:
        'Vrlo dobro iskustvo. Jedina primjedba je da ponekad kasni 5-10 minuta, ali kvaliteta nastave to nadoknađuje.',
      createdAt: new Date('2025-01-10'),
      verifiedPurchase: true,
      helpful: 12,
      notHelpful: 2,
      tutorResponse: {
        text: 'Hvala na povratnoj informaciji. Ispričavam se zbog kašnjenja i obećavam da ću biti točnija u budućnosti!',
        createdAt: new Date('2025-01-11'),
      },
      userVote: null,
    },
    {
      id: '4',
      reviewer: {
        name: 'Laura Babić',
      },
      rating: 5,
      expertise: 5,
      comment:
        'Super! Preporučujem svima koji imaju problema s matematikom. Ana ima dar za objašnjavanje.',
      createdAt: new Date('2025-01-08'),
      verifiedPurchase: false,
      helpful: 8,
      notHelpful: 0,
      userVote: null,
    },
  ]

  // Filter and sort reviews
  let filteredReviews = allReviews.filter((review) => {
    if (filterRating !== 'all' && review.rating !== filterRating) return false
    if (filterVerified && !review.verifiedPurchase) return false
    if (filterWithMedia && !review.photos && !review.videos) return false
    return true
  })

  // Sort reviews
  filteredReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return b.helpful - a.helpful
      case 'rating_high':
        return b.rating - a.rating
      case 'rating_low':
        return a.rating - b.rating
      case 'recent':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime()
    }
  })

  const calculatePercentage = (count: number) => {
    return ((count / tutorData.totalReviews) * 100).toFixed(0)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recenzije - {tutorData.name}
          </h1>
          <p className="text-gray-600">{tutorData.totalReviews} recenzija</p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            icon={<Filter className="w-5 h-5" />}
            onClick={() => setShowFilters(!showFilters)}
            fullWidth
          >
            {showFilters ? 'Sakrij filtere' : 'Prikaži filtere'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Stats */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Pregled ocjena
              </h3>

              {/* Overall Rating */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="text-5xl font-bold text-gradient mb-2">
                  {tutorData.averageRating.toFixed(1)}
                </div>
                <StarRating rating={tutorData.averageRating} readonly size="lg" />
                <p className="text-sm text-gray-600 mt-2">
                  Temeljem {tutorData.totalReviews} recenzija
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3 mb-6">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = tutorData.ratingBreakdown[rating as keyof typeof tutorData.ratingBreakdown]
                  const percentage = calculatePercentage(count)

                  return (
                    <button
                      key={rating}
                      onClick={() => setFilterRating(filterRating === rating ? 'all' : rating)}
                      className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                        filterRating === rating ? 'bg-primary-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-1 w-16">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </button>
                  )
                })}
              </div>

              {/* Filter Options */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Filteri</h4>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterVerified}
                    onChange={(e) => setFilterVerified(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    Samo verificirane kupnje
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterWithMedia}
                    onChange={(e) => setFilterWithMedia(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    Samo s fotografijama/videom
                  </span>
                </label>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                    Verificirane
                  </span>
                  <span className="font-medium">
                    {allReviews.filter((r) => r.verifiedPurchase).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-1 text-blue-600" />
                    S fotografijama
                  </span>
                  <span className="font-medium">
                    {allReviews.filter((r) => r.photos && r.photos.length > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Video className="w-4 h-4 mr-1 text-purple-600" />
                    S videom
                  </span>
                  <span className="font-medium">
                    {allReviews.filter((r) => r.videos && r.videos.length > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1 text-orange-600" />
                    S odgovorom
                  </span>
                  <span className="font-medium">
                    {allReviews.filter((r) => r.tutorResponse).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right - Reviews List */}
          <div className="lg:col-span-2">
            {/* Sort Options */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Prikazano {filteredReviews.length} od {tutorData.totalReviews} recenzija
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'lowest' | 'helpful')}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none"
                >
                  <option value="recent">Najnovije</option>
                  <option value="helpful">Najkorisnije</option>
                  <option value="rating_high">Najviša ocjena</option>
                  <option value="rating_low">Najniža ocjena</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
            </div>

            {/* Active Filters */}
            {(filterRating !== 'all' || filterVerified || filterWithMedia) && (
              <div className="mb-4 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Aktivni filteri:</span>
                {filterRating !== 'all' && (
                  <Badge variant="info">
                    {filterRating} zvjezdica
                    <button
                      onClick={() => setFilterRating('all')}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filterVerified && (
                  <Badge variant="success">
                    Verificirane
                    <button
                      onClick={() => setFilterVerified(false)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filterWithMedia && (
                  <Badge variant="secondary">
                    S medijima
                    <button
                      onClick={() => setFilterWithMedia(false)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Reviews */}
            <div className="space-y-6">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <Card className="text-center py-16">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 mb-2">Nema recenzija</p>
                  <p className="text-sm text-gray-500">
                    Pokušajte promijeniti filtere
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
