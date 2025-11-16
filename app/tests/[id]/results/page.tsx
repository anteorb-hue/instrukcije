'use client'

import React, { useState } from 'react'
import {
  ArrowLeft,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Target,
  BarChart,
  Download,
  Share2,
  RefreshCw,
  BookOpen,
  AlertTriangle,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'

interface TestResultsProps {
  params: { id: string }
}

interface TopicPerformance {
  topic: string
  correct: number
  total: number
  percentage: number
}

interface Recommendation {
  id: string
  title: string
  description: string
  type: 'lesson' | 'resource' | 'practice'
  icon: React.ReactNode
}

export default function TestResultsPage({ params }: TestResultsProps) {
  const router = useRouter()
  const [showDetailedAnswers, setShowDetailedAnswers] = useState(false)

  // Mock results data
  const results = {
    testId: params.id,
    testTitle: 'Dijagnostički test - Matematika (Osnove)',
    score: 85,
    passingScore: 70,
    passed: true,
    totalQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    skippedQuestions: 0,
    totalPoints: 48,
    earnedPoints: 41,
    timeSpent: 1250, // in seconds
    completedAt: new Date(),
    attemptNumber: 1,
    maxAttempts: 3,
  }

  const topicPerformance: TopicPerformance[] = [
    { topic: 'Aritmetika', correct: 3, total: 3, percentage: 100 },
    { topic: 'Algebra', correct: 2, total: 2, percentage: 100 },
    { topic: 'Geometrija', correct: 2, total: 3, percentage: 67 },
    { topic: 'Teorija brojeva', correct: 1, total: 2, percentage: 50 },
  ]

  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Osnove geometrije',
      description: 'Dodatni materijali za osvježavanje osnovnih geometrijskih koncepata',
      type: 'resource',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: '2',
      title: 'Vježbaj teoriju brojeva',
      description: 'Dodatni zadaci za vježbu prostih brojeva i faktorizacije',
      type: 'practice',
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: '3',
      title: 'Privatna lekcija - Geometrija',
      description: 'Rezerviraj lekciju s instruktorom za detaljno objašnjenje',
      type: 'lesson',
      icon: <Star className="w-5 h-5" />,
    },
  ]

  const detailedAnswers = [
    {
      question: 'Koliko je 5 + 3 × 2?',
      yourAnswer: '11',
      correctAnswer: '11',
      isCorrect: true,
      explanation: 'Točno! Prvo množiš 3 × 2 = 6, zatim dodaješ 5 + 6 = 11.',
      topic: 'Aritmetika',
      points: 5,
    },
    {
      question: 'Koja je formula za opseg kruga?',
      yourAnswer: '2πr',
      correctAnswer: '2πr',
      isCorrect: true,
      explanation: 'Točno! Opseg kruga je 2πr ili πd (gdje je d promjer).',
      topic: 'Geometrija',
      points: 5,
    },
    {
      question: 'Broj 17 je prost broj.',
      yourAnswer: 'Točno',
      correctAnswer: 'Točno',
      isCorrect: true,
      explanation: 'Točno! Broj 17 je prost broj jer je djeljiv samo sa 1 i sa samim sobom.',
      topic: 'Teorija brojeva',
      points: 3,
    },
    {
      question: 'Što je rezultat izraza: 3x + 2 = 11? Koliko je x?',
      yourAnswer: '3',
      correctAnswer: '3',
      isCorrect: true,
      explanation: 'Točno! 3x = 9, pa je x = 3.',
      topic: 'Algebra',
      points: 5,
    },
    {
      question: 'Kvadrat broja uvijek je pozitivan ili nula.',
      yourAnswer: 'Točno',
      correctAnswer: 'Točno',
      isCorrect: true,
      explanation: 'Točno! Kvadrat bilo kojeg broja (pozitivnog ili negativnog) je uvijek pozitivan ili nula.',
      topic: 'Algebra',
      points: 3,
    },
    {
      question: 'Objasni razliku između aritmetičkog i geometrijskog niza.',
      yourAnswer: 'Aritmetički niz ima konstantnu razliku, geometrijski ima konstantan omjer.',
      correctAnswer: 'N/A',
      isCorrect: true,
      explanation: 'Odličan odgovor! Aritmetički niz ima konstantnu razliku između uzastopnih članova, dok geometrijski niz ima konstantan omjer.',
      topic: 'Nizovi',
      points: 10,
    },
    {
      question: 'Koliko stupnjeva ima trokut?',
      yourAnswer: '180°',
      correctAnswer: '180°',
      isCorrect: true,
      explanation: 'Točno! Suma kutova u trokutu je uvijek 180°.',
      topic: 'Geometrija',
      points: 3,
    },
    {
      question: 'Broj 1 je prost broj.',
      yourAnswer: 'Točno',
      correctAnswer: 'Netočno',
      isCorrect: false,
      explanation: 'Netočno. Broj 1 NIJE prost broj. Prosti brojevi moraju biti djeljivi sa točno dva različita prirodna broja (1 i samim sobom), dok je 1 djeljiv samo sa jednim brojem.',
      topic: 'Teorija brojeva',
      points: 3,
    },
    {
      question: 'Što je 25% od 80?',
      yourAnswer: '20',
      correctAnswer: '20',
      isCorrect: true,
      explanation: 'Točno! 25% od 80 = 0.25 × 80 = 20.',
      topic: 'Aritmetika',
      points: 5,
    },
    {
      question: 'Napiši Pitagorin poučak i objasni njegovu primjenu.',
      yourAnswer: 'a² + b² = c²',
      correctAnswer: 'N/A',
      isCorrect: false,
      explanation: 'Djelomično točno. Napisao/la si formulu, ali nisi objasnio/la primjenu. Pitagorin poučak se koristi za izračunavanje stranica pravokutnog trokuta.',
      topic: 'Geometrija',
      points: 10,
    },
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = () => {
    if (results.score >= 90) return { label: 'Izvrsno!', variant: 'success' as const }
    if (results.score >= 75) return { label: 'Vrlo dobro', variant: 'info' as const }
    if (results.score >= 60) return { label: 'Dobro', variant: 'warning' as const }
    return { label: 'Treba više vježbe', variant: 'danger' as const }
  }

  const scoreBadge = getScoreBadge()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.push('/tests')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Natrag na testove
        </button>

        {/* Results Header */}
        <Card className="mb-6">
          <div className="text-center mb-6">
            {results.passed ? (
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-12 h-12 text-green-600" />
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            )}
            <Badge variant={scoreBadge.variant} className="mb-3">
              {scoreBadge.label}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{results.testTitle}</h1>
            <p className={`text-6xl font-bold mb-2 ${getScoreColor(results.score)}`}>
              {results.score}%
            </p>
            <p className="text-gray-600">
              {results.passed ? 'Čestitamo! Prošao/la si test.' : 'Nažalost, nisi prošao/la test.'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{results.correctAnswers}</p>
              <p className="text-sm text-gray-600">Točnih odgovora</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{results.incorrectAnswers}</p>
              <p className="text-sm text-gray-600">Netočnih odgovora</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {results.earnedPoints}/{results.totalPoints}
              </p>
              <p className="text-sm text-gray-600">Bodova</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{formatTime(results.timeSpent)}</p>
              <p className="text-sm text-gray-600">Utrošeno vrijeme</p>
            </div>
          </div>
        </Card>

        {/* Topic Performance */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart className="w-6 h-6 mr-2 text-primary-600" />
            Uspješnost po temama
          </h2>
          <div className="space-y-4">
            {topicPerformance.map((topic) => (
              <div key={topic.topic}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{topic.topic}</span>
                  <span className="text-sm text-gray-600">
                    {topic.correct}/{topic.total} točno ({topic.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      topic.percentage === 100
                        ? 'bg-green-500'
                        : topic.percentage >= 75
                        ? 'bg-blue-500'
                        : topic.percentage >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${topic.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Preporuke za napredak
            </h2>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                    <p className="text-sm text-gray-700">{rec.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {rec.type === 'lesson' ? 'Rezerviraj' : 'Pogledaj'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Detailed Answers */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Detaljni pregled odgovora</h2>
            <button
              onClick={() => setShowDetailedAnswers(!showDetailedAnswers)}
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              {showDetailedAnswers ? (
                <>
                  Sakrij <ChevronUp className="w-5 h-5 ml-1" />
                </>
              ) : (
                <>
                  Prikaži <ChevronDown className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>

          {showDetailedAnswers && (
            <div className="space-y-4">
              {detailedAnswers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg ${
                    answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary">{answer.topic}</Badge>
                        <span className="text-sm text-gray-600">{answer.points} bodova</span>
                      </div>
                      <p className="font-medium text-gray-900 mb-2">{answer.question}</p>
                    </div>
                    {answer.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 ml-4" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 ml-4" />
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Tvoj odgovor: </span>
                      <span
                        className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}
                      >
                        {answer.yourAnswer}
                      </span>
                    </div>
                    {!answer.isCorrect && answer.correctAnswer !== 'N/A' && (
                      <div>
                        <span className="font-medium text-gray-700">Točan odgovor: </span>
                        <span className="text-green-700">{answer.correctAnswer}</span>
                      </div>
                    )}
                    <div className="p-3 bg-white/50 rounded">
                      <span className="font-medium text-gray-700">Objašnjenje: </span>
                      <span className="text-gray-700">{answer.explanation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="primary"
            icon={<Download className="w-5 h-5" />}
            onClick={() => alert('Preuzimanje PDF izvještaja...')}
          >
            Preuzmi izvještaj
          </Button>
          <Button
            variant="outline"
            icon={<Share2 className="w-5 h-5" />}
            onClick={() => alert('Podijeli rezultate...')}
          >
            Podijeli rezultate
          </Button>
          {results.attemptNumber < results.maxAttempts && (
            <Button
              variant="outline"
              icon={<RefreshCw className="w-5 h-5" />}
              onClick={() => router.push(`/tests/${params.id}`)}
            >
              Ponovi test ({results.maxAttempts - results.attemptNumber} preostalih pokušaja)
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
