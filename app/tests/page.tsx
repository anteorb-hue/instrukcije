'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import {
  FileText,
  Clock,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  Filter,
  Search,
  Calendar,
  BarChart,
  Star,
  AlertCircle,
  Users,
  Loader2,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TestsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  // Build API query params
  const params = new URLSearchParams()
  if (searchQuery) params.append('search', searchQuery)
  if (selectedSubject !== 'all') params.append('subjectId', selectedSubject)
  if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty.toUpperCase())
  params.append('isPublic', 'true')
  params.append('isActive', 'true')
  params.append('limit', '50')

  // Fetch tests from API
  const { data, error, isLoading } = useSWR(
    `/api/tests?${params.toString()}`,
    fetcher
  )

  // Fetch subjects for filter
  const { data: subjectsData } = useSWR('/api/subjects', fetcher)

  const tests = data?.tests || []
  const subjects = subjectsData || []

  const stats = {
    totalTests: data?.total || 0,
    completedTests: 0, // TODO: Filter user's completed submissions
    averageScore: 0, // TODO: Calculate from user's submissions
    activeTests: tests.filter((t: any) => t.isActive).length,
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      EASY: 'Lako',
      MEDIUM: 'Srednje',
      HARD: 'Teško',
      EXPERT: 'Ekspert',
    }
    return labels[difficulty] || difficulty
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'text-green-600'
      case 'MEDIUM':
        return 'text-yellow-600'
      case 'HARD':
      case 'EXPERT':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getEducationLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      OSNOVNA_SKOLA: 'Osnovna škola',
      SREDNJA_SKOLA: 'Srednja škola',
      FAKULTET: 'Fakultet',
      OSTALO: 'Ostalo',
    }
    return labels[level] || level
  }

  const handleStartTest = (testId: string) => {
    router.push(`/tests/${testId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Testovi i provjere znanja</h1>
          <p className="text-gray-600">
            Testiraj svoje znanje, otkrij područja za napredak i prati svoj progres
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalTests}</p>
            <p className="text-sm text-gray-600">Dostupnih testova</p>
          </Card>
          <Card className="text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.completedTests}</p>
            <p className="text-sm text-gray-600">Završeno</p>
          </Card>
          <Card className="text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.averageScore}%</p>
            <p className="text-sm text-gray-600">Prosječna ocjena</p>
          </Card>
          <Card className="text-center">
            <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.activeTests}</p>
            <p className="text-sm text-gray-600">Aktivnih</p>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Pretraži testove..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field"
            >
              <option value="all">Svi predmeti</option>
              {subjects.map((subject: any) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input-field"
            >
              <option value="all">Sve težine</option>
              <option value="easy">Lako</option>
              <option value="medium">Srednje</option>
              <option value="hard">Teško</option>
              <option value="expert">Ekspert</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center col-span-2">
              {!isLoading && `${tests.length} rezultata`}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="text-center py-12">
            <p className="text-lg text-red-600">Greška pri učitavanju testova</p>
            <p className="text-sm text-gray-500 mt-2">Molimo pokušajte ponovno</p>
          </Card>
        )}

        {/* Tests Grid */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 gap-6">
            {tests.length > 0 ? (
              tests.map((test: any) => (
                <Card key={test.id} hover className="relative">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="info">
                          {getDifficultyLabel(test.difficulty)}
                        </Badge>
                        {test.educationLevel && (
                          <Badge variant="secondary">
                            {getEducationLevelLabel(test.educationLevel)}
                          </Badge>
                        )}
                        {test.isPublic && (
                          <Badge variant="success">Javni</Badge>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {test.description || 'Nema opisa'}
                    </p>
                  </div>

                  {/* Test Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                    {test.timeLimit && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{test.timeLimit} min</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{test._count?.questions || 0} pitanja</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2" />
                      <span>Prolaz: {test.passingScore}%</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{test.tutor?.name || 'Nepoznato'}</span>
                    </div>
                  </div>

                  {/* Subject */}
                  {test.subject && (
                    <div className="mb-4">
                      <Badge variant="info">{test.subject.name}</Badge>
                    </div>
                  )}

                  {/* Action */}
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      className="w-full"
                      icon={<Play className="w-5 h-5" />}
                      onClick={() => handleStartTest(test.id)}
                    >
                      Počni test
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card className="text-center py-16">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 mb-2">Nema dostupnih testova</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Pokušajte promijeniti filtere ili se vratite kasnije
                  </p>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-12 gradient-bg text-white">
          <div className="flex items-start space-x-4">
            <Award className="w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Zašto raditi testove?</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Provjeri svoje znanje</strong> kroz raznovrsne testove i kvizove
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Vježbaj i ponavljaj</strong> gradivo koliko god puta želiš
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Prati svoj napredak</strong> kroz detaljne statistike
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Dobij povratne informacije</strong> od iskusnih instruktora
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
