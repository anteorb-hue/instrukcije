'use client'

import React, { useState } from 'react'
import {
  FileText,
  Clock,
  Target,
  TrendingUp,
  Award,
  Play,
  CheckCircle,
  Search,
  BarChart,
  AlertCircle,
  Users,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

interface Test {
  id: string
  title: string
  description: string
  subject: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  totalQuestions: number
  passingScore: number
  type: 'diagnostic' | 'practice' | 'final'
  difficulty: 'easy' | 'medium' | 'hard'
  completed: boolean
  score?: number
  completedAt?: Date
  attempts: number
  maxAttempts: number
  topics: string[]
  createdBy: string
}

export default function TestsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [filterCompleted, setFilterCompleted] = useState<string>('all')

  const tests: Test[] = [
    {
      id: '1',
      title: 'Dijagnostički test - Matematika (Osnove)',
      description: 'Provjeri svoje znanje osnovnih matematičkih koncepata i otkrij područja za poboljšanje',
      subject: 'Matematika',
      level: 'beginner',
      duration: 30,
      totalQuestions: 20,
      passingScore: 70,
      type: 'diagnostic',
      difficulty: 'easy',
      completed: true,
      score: 85,
      completedAt: new Date('2025-01-05'),
      attempts: 1,
      maxAttempts: 3,
      topics: ['Aritmetika', 'Algebrske osnove', 'Geometrija'],
      createdBy: 'Ana Horvat',
    },
    {
      id: '2',
      title: 'Vježbovni test - Derivacije',
      description: 'Vježbaj derivacije i njihovu primjenu kroz raznovrsne zadatke',
      subject: 'Matematika',
      level: 'advanced',
      duration: 45,
      totalQuestions: 15,
      passingScore: 75,
      type: 'practice',
      difficulty: 'hard',
      completed: false,
      attempts: 0,
      maxAttempts: 5,
      topics: ['Derivacije', 'Primjena derivacija', 'Ekstremumi funkcija'],
      createdBy: 'Ana Horvat',
    },
    {
      id: '3',
      title: 'Završni ispit - React.js',
      description: 'Završni test koji pokriva sve aspekte React.js razvoja',
      subject: 'Programiranje',
      level: 'intermediate',
      duration: 60,
      totalQuestions: 30,
      passingScore: 80,
      type: 'final',
      difficulty: 'medium',
      completed: true,
      score: 92,
      completedAt: new Date('2025-01-10'),
      attempts: 1,
      maxAttempts: 2,
      topics: ['Components', 'Hooks', 'State Management', 'Routing'],
      createdBy: 'Marko Novak',
    },
    {
      id: '4',
      title: 'Dijagnostički test - Engleski jezik (B1)',
      description: 'Procijeni svoju razinu engleskog jezika i dobij personalizirane preporuke',
      subject: 'Engleski jezik',
      level: 'intermediate',
      duration: 40,
      totalQuestions: 25,
      passingScore: 70,
      type: 'diagnostic',
      difficulty: 'medium',
      completed: false,
      attempts: 0,
      maxAttempts: 3,
      topics: ['Grammar', 'Vocabulary', 'Reading Comprehension'],
      createdBy: 'Petra Kovačić',
    },
    {
      id: '5',
      title: 'Vježbovni test - Organska kemija',
      description: 'Testiraj svoje znanje osnovnih reakcija organske kemije',
      subject: 'Kemija',
      level: 'intermediate',
      duration: 50,
      totalQuestions: 20,
      passingScore: 75,
      type: 'practice',
      difficulty: 'medium',
      completed: false,
      attempts: 1,
      maxAttempts: 5,
      topics: ['Nomenklatura', 'Reakcijski mehanizmi', 'Funkcionalne grupe'],
      createdBy: 'Ivan Petrović',
    },
  ]

  const subjects = Array.from(new Set(tests.map((t) => t.subject)))

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === 'all' || test.subject === selectedSubject
    const matchesLevel = selectedLevel === 'all' || test.level === selectedLevel
    const matchesType = selectedType === 'all' || test.type === selectedType
    const matchesCompleted =
      filterCompleted === 'all' ||
      (filterCompleted === 'completed' && test.completed) ||
      (filterCompleted === 'not-completed' && !test.completed)
    return matchesSearch && matchesSubject && matchesLevel && matchesType && matchesCompleted
  })

  const stats = {
    totalTests: tests.length,
    completedTests: tests.filter((t) => t.completed).length,
    averageScore: Math.round(
      tests.filter((t) => t.score).reduce((sum, t) => sum + (t.score || 0), 0) /
        tests.filter((t) => t.score).length || 0
    ),
    diagnosticTests: tests.filter((t) => t.type === 'diagnostic').length,
  }

  const getLevelBadge = (level: string) => {
    const labels = {
      beginner: 'Početnik',
      intermediate: 'Srednji',
      advanced: 'Napredni',
    }
    return labels[level as keyof typeof labels] || level
  }

  const getTypeBadge = (type: string) => {
    const labels = {
      diagnostic: 'Dijagnostički',
      practice: 'Vježbovni',
      final: 'Završni',
    }
    return labels[type as keyof typeof labels] || type
  }

  const _getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'hard':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleStartTest = (testId: string) => {
    router.push(`/tests/${testId}`)
  }

  const handleViewResults = (testId: string) => {
    router.push(`/tests/${testId}/results`)
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
            <p className="text-2xl font-bold text-orange-600">{stats.diagnosticTests}</p>
            <p className="text-sm text-gray-600">Dijagnostičkih</p>
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
            <Button
              variant="primary"
              icon={<BarChart className="w-5 h-5" />}
              onClick={() => router.push('/tests/my-progress')}
            >
              Moj napredak
            </Button>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
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
              <option value="diagnostic">Dijagnostički</option>
              <option value="practice">Vježbovni</option>
              <option value="final">Završni</option>
            </select>

            <select
              value={filterCompleted}
              onChange={(e) => setFilterCompleted(e.target.value)}
              className="input-field"
            >
              <option value="all">Svi testovi</option>
              <option value="not-completed">Nezavršeni</option>
              <option value="completed">Završeni</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredTests.length} rezultata
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <Card key={test.id} hover className="relative">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          test.type === 'diagnostic'
                            ? 'info'
                            : test.type === 'practice'
                            ? 'secondary'
                            : 'warning'
                        }
                      >
                        {getTypeBadge(test.type)}
                      </Badge>
                      <Badge variant="secondary">{getLevelBadge(test.level)}</Badge>
                      {test.completed && (
                        <Badge variant="success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Završeno
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{test.description}</p>
                </div>

                {/* Test Info */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{test.duration} min</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{test.totalQuestions} pitanja</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Target className="w-4 h-4 mr-2" />
                    <span>Prolaz: {test.passingScore}%</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{test.createdBy}</span>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Pokrivene teme:</p>
                  <div className="flex flex-wrap gap-1">
                    {test.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score or Action */}
                {test.completed && test.score !== undefined ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Tvoj rezultat</p>
                        <p className={`text-2xl font-bold ${getScoreColor(test.score)}`}>
                          {test.score}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {test.completedAt?.toLocaleDateString('hr-HR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          Pokušaj {test.attempts}/{test.maxAttempts}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewResults(test.id)}
                      >
                        Vidi rezultate
                      </Button>
                      {test.attempts < test.maxAttempts && (
                        <Button
                          variant="primary"
                          className="flex-1"
                          icon={<Play className="w-4 h-4" />}
                          onClick={() => handleStartTest(test.id)}
                        >
                          Ponovi
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {test.attempts > 0 && (
                      <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Pokušaj {test.attempts}/{test.maxAttempts}
                      </div>
                    )}
                    <Button
                      variant="primary"
                      className="w-full"
                      icon={<Play className="w-5 h-5" />}
                      onClick={() => handleStartTest(test.id)}
                      disabled={test.attempts >= test.maxAttempts}
                    >
                      {test.attempts >= test.maxAttempts
                        ? 'Nema više pokušaja'
                        : test.attempts > 0
                        ? 'Nastavi test'
                        : 'Počni test'}
                    </Button>
                  </div>
                )}
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
                    <strong>Dijagnostički testovi</strong> ti pokazuju trenutnu razinu znanja i
                    područja za napredak
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Vježbovni testovi</strong> pomoću kojih možeš vježbati i učvrstiti
                    naučeno gradivo
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Završni testovi</strong> za certifikaciju i potvrdu stečenih znanja
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Personalizirane preporuke</strong> za dodatno učenje baziran na
                    rezultatima
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
