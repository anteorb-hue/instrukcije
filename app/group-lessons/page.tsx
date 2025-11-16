'use client'

import React, { useState } from 'react'
import {
  Users,
  Calendar,
  Clock,
  Video,
  DollarSign,
  Star,
  TrendingUp,
  Filter,
  Search,
  Plus,
  BookOpen,
  Award,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

interface GroupLesson {
  id: string
  title: string
  description: string
  subject: string
  tutor: {
    id: string
    name: string
    avatar?: string
    rating: number
  }
  startDate: Date
  duration: number
  maxParticipants: number
  currentParticipants: number
  pricePerPerson: number
  level: 'beginner' | 'intermediate' | 'advanced'
  type: 'webinar' | 'group-lesson'
  hasRecording: boolean
  tags: string[]
}

export default function GroupLessonsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const router = useRouter()

  const groupLessons: GroupLesson[] = [
    {
      id: '1',
      title: 'Priprema za maturu - Matematika',
      description: 'Intenzivna grupna priprema za državnu maturu iz matematike. Pokrivamo sve ključne teme: funkcije, derivacije, integrale i vjerojatnost.',
      subject: 'Matematika',
      tutor: {
        id: 'tutor-1',
        name: 'Ana Horvat',
        rating: 4.9,
      },
      startDate: new Date('2025-01-20T18:00:00'),
      duration: 90,
      maxParticipants: 15,
      currentParticipants: 12,
      pricePerPerson: 80,
      level: 'advanced',
      type: 'group-lesson',
      hasRecording: true,
      tags: ['matura', 'matematika', 'priprema'],
    },
    {
      id: '2',
      title: 'React za početnike - Webinar',
      description: 'Naučite osnove React.js-a kroz praktične primjere. Pokrivamo components, props, state, hooks i routing.',
      subject: 'Programiranje',
      tutor: {
        id: 'tutor-2',
        name: 'Marko Novak',
        rating: 4.8,
      },
      startDate: new Date('2025-01-22T19:00:00'),
      duration: 120,
      maxParticipants: 30,
      currentParticipants: 25,
      pricePerPerson: 100,
      level: 'beginner',
      type: 'webinar',
      hasRecording: true,
      tags: ['react', 'javascript', 'web-development'],
    },
    {
      id: '3',
      title: 'Engleski konverzacija - Intermediate',
      description: 'Vježbajte engleski kroz praktičnu konverzaciju u grupi. Teme: putovanja, posao, svakodnevni život.',
      subject: 'Engleski jezik',
      tutor: {
        id: 'tutor-3',
        name: 'Petra Kovačić',
        rating: 5.0,
      },
      startDate: new Date('2025-01-18T17:00:00'),
      duration: 60,
      maxParticipants: 10,
      currentParticipants: 7,
      pricePerPerson: 60,
      level: 'intermediate',
      type: 'group-lesson',
      hasRecording: false,
      tags: ['konverzacija', 'speaking', 'intermediate'],
    },
    {
      id: '4',
      title: 'Organska kemija - Pripreme za ispit',
      description: 'Grupna priprema za ispit iz organske kemije. Fokus na nomenklaturu, reakcije i mehanizme.',
      subject: 'Kemija',
      tutor: {
        id: 'tutor-4',
        name: 'Ivan Petrović',
        rating: 4.7,
      },
      startDate: new Date('2025-01-25T16:00:00'),
      duration: 90,
      maxParticipants: 12,
      currentParticipants: 5,
      pricePerPerson: 70,
      level: 'intermediate',
      type: 'group-lesson',
      hasRecording: true,
      tags: ['organska-kemija', 'ispit', 'fakultet'],
    },
  ]

  const subjects = Array.from(new Set(groupLessons.map((l) => l.subject)))

  const filteredLessons = groupLessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === 'all' || lesson.subject === selectedSubject
    const matchesLevel = selectedLevel === 'all' || lesson.level === selectedLevel
    const matchesType = selectedType === 'all' || lesson.type === selectedType
    return matchesSearch && matchesSubject && matchesLevel && matchesType
  })

  const stats = {
    totalLessons: groupLessons.length,
    totalParticipants: groupLessons.reduce((sum, l) => sum + l.currentParticipants, 0),
    avgPrice: Math.round(
      groupLessons.reduce((sum, l) => sum + l.pricePerPerson, 0) / groupLessons.length
    ),
    upcomingThisWeek: groupLessons.filter((l) => {
      const diff = l.startDate.getTime() - Date.now()
      return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
    }).length,
  }

  const getAvailableSpots = (lesson: GroupLesson) => {
    return lesson.maxParticipants - lesson.currentParticipants
  }

  const getSpotsBadge = (lesson: GroupLesson) => {
    const available = getAvailableSpots(lesson)
    if (available === 0) {
      return <Badge variant="danger">Popunjeno</Badge>
    } else if (available <= 3) {
      return <Badge variant="warning">Samo {available} mjesta</Badge>
    } else {
      return <Badge variant="success">{available} slobodnih mjesta</Badge>
    }
  }

  const getLevelBadge = (level: string) => {
    const labels = {
      beginner: 'Početnik',
      intermediate: 'Srednji',
      advanced: 'Napredni',
    }
    return labels[level as keyof typeof labels] || level
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grupne instrukcije i webinari</h1>
          <p className="text-gray-600">
            Uči u grupi, štedi novac i upoznaj druge učenike
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalLessons}</p>
            <p className="text-sm text-gray-600">Dostupnih lekcija</p>
          </Card>
          <Card className="text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.totalParticipants}</p>
            <p className="text-sm text-gray-600">Ukupno polaznika</p>
          </Card>
          <Card className="text-center">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.avgPrice} kn</p>
            <p className="text-sm text-gray-600">Prosječna cijena</p>
          </Card>
          <Card className="text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.upcomingThisWeek}</p>
            <p className="text-sm text-gray-600">Ovaj tjedan</p>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Pretraži lekcije..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => router.push('/group-lessons/create')}
            >
              Kreiraj grupnu lekciju
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field"
            >
              <option value="all">Svi predmeti</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="input-field"
            >
              <option value="all">Sve razine</option>
              <option value="beginner">Početnik</option>
              <option value="intermediate">Srednji</option>
              <option value="advanced">Napredni</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
            >
              <option value="all">Svi tipovi</option>
              <option value="group-lesson">Grupna lekcija</option>
              <option value="webinar">Webinar</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredLessons.length} rezultata
            </div>
          </div>
        </div>

        {/* Group Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => {
              const availableSpots = getAvailableSpots(lesson)
              const isFull = availableSpots === 0

              return (
                <Card
                  key={lesson.id}
                  hover
                  className={`cursor-pointer ${isFull ? 'opacity-75' : ''}`}
                  onClick={() => router.push(`/group-lessons/${lesson.id}`)}
                >
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={lesson.type === 'webinar' ? 'info' : 'secondary'}>
                        {lesson.type === 'webinar' ? 'Webinar' : 'Grupna lekcija'}
                      </Badge>
                      {lesson.hasRecording && (
                        <Badge variant="warning" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Snimka
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Tutor */}
                  <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm">
                      {lesson.tutor.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{lesson.tutor.name}</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{lesson.tutor.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {lesson.startDate.toLocaleDateString('hr-HR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {lesson.startDate.toLocaleTimeString('hr-HR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      • {lesson.duration} min
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {lesson.currentParticipants}/{lesson.maxParticipants} polaznika
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {getLevelBadge(lesson.level)}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {lesson.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        {lesson.pricePerPerson} kn
                      </p>
                      <p className="text-xs text-gray-500">po osobi</p>
                    </div>
                    {getSpotsBadge(lesson)}
                  </div>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full">
              <Card className="text-center py-16">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-2">Nema dostupnih lekcija</p>
                <p className="text-sm text-gray-500 mb-6">
                  Pokušajte promijeniti filtere ili kreirajte novu grupnu lekciju
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/group-lessons/create')}
                >
                  Kreiraj grupnu lekciju
                </Button>
              </Card>
            </div>
          )}
        </div>

        {/* Info Section */}
        <Card className="mt-12 gradient-bg text-white">
          <div className="flex items-start space-x-4">
            <Award className="w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Prednosti grupnih lekcija</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Niža cijena</strong> - Podijeli troškove s drugim polaznicima
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Učenje kroz raspravu</strong> - Razmijenite iskustva s kolegama
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Snimke dostupne</strong> - Pogledaj ponovno kad god želiš
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Networking</strong> - Upoznaj druge učenike s istim interesima
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
