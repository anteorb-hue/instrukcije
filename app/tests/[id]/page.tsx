'use client'

import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  X,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'

interface TestTakingProps {
  params: { id: string }
}

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'open-ended'
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  topic: string
}

interface Answer {
  questionId: string
  answer: string | number | null
  flagged: boolean
}

export default function TestTakingPage({ params }: TestTakingProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [testStarted, setTestStarted] = useState(false)

  // Mock test data
  const test = {
    id: params.id,
    title: 'Dijagnostički test - Matematika (Osnove)',
    subject: 'Matematika',
    duration: 30,
    totalQuestions: 10,
    passingScore: 70,
  }

  const questions: Question[] = [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Koliko je 5 + 3 × 2?',
      options: ['10', '11', '16', '13'],
      correctAnswer: 1,
      points: 5,
      topic: 'Aritmetika',
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'Koja je formula za opseg kruga?',
      options: ['2πr', 'πr²', 'πd', '2r'],
      correctAnswer: 0,
      points: 5,
      topic: 'Geometrija',
    },
    {
      id: 'q3',
      type: 'true-false',
      question: 'Broj 17 je prost broj.',
      correctAnswer: 'true',
      points: 3,
      topic: 'Teorija brojeva',
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      question: 'Što je rezultat izraza: 3x + 2 = 11? Koliko je x?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 1,
      points: 5,
      topic: 'Algebra',
    },
    {
      id: 'q5',
      type: 'true-false',
      question: 'Kvadrat broja uvijek je pozitivan ili nula.',
      correctAnswer: 'true',
      points: 3,
      topic: 'Algebra',
    },
    {
      id: 'q6',
      type: 'open-ended',
      question: 'Objasni razliku između aritmetičkog i geometrijskog niza.',
      points: 10,
      topic: 'Nizovi',
    },
    {
      id: 'q7',
      type: 'multiple-choice',
      question: 'Koliko stupnjeva ima trokut?',
      options: ['90°', '180°', '270°', '360°'],
      correctAnswer: 1,
      points: 3,
      topic: 'Geometrija',
    },
    {
      id: 'q8',
      type: 'true-false',
      question: 'Broj 1 je prost broj.',
      correctAnswer: 'false',
      points: 3,
      topic: 'Teorija brojeva',
    },
    {
      id: 'q9',
      type: 'multiple-choice',
      question: 'Što je 25% od 80?',
      options: ['15', '20', '25', '30'],
      correctAnswer: 1,
      points: 5,
      topic: 'Aritmetika',
    },
    {
      id: 'q10',
      type: 'open-ended',
      question: 'Napiši Pitagorin poučak i objasni njegovu primjenu.',
      points: 10,
      topic: 'Geometrija',
    },
  ]

  // Initialize answers
  useEffect(() => {
    const initialAnswers: Answer[] = questions.map((q) => ({
      questionId: q.id,
      answer: null,
      flagged: false,
    }))
    setAnswers(initialAnswers)
  }, [])

  // Timer
  useEffect(() => {
    if (!testStarted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testStarted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (answer: string | number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = {
      ...newAnswers[currentQuestion],
      answer,
    }
    setAnswers(newAnswers)
  }

  const handleToggleFlag = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = {
      ...newAnswers[currentQuestion],
      flagged: !newAnswers[currentQuestion].flagged,
    }
    setAnswers(newAnswers)
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleQuestionJump = (index: number) => {
    setCurrentQuestion(index)
  }

  const handleSubmitTest = () => {
    // In real app: send answers to API
    router.push(`/tests/${params.id}/results`)
  }

  const getAnswerStatus = (index: number) => {
    if (answers[index]?.answer !== null) return 'answered'
    if (answers[index]?.flagged) return 'flagged'
    return 'unanswered'
  }

  const answeredCount = answers.filter((a) => a.answer !== null).length
  const flaggedCount = answers.filter((a) => a.flagged).length

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom max-w-3xl">
          <button
            onClick={() => router.push('/tests')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Natrag na testove
          </button>

          <Card>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{test.title}</h1>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-2 text-primary-600" />
                  <span>Trajanje: {test.duration} minuta</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  <span>{test.totalQuestions} pitanja</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Upute za test</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Imaš {test.duration} minuta za rješavanje testa</li>
                  <li>• Možeš se vratiti na prethodna pitanja i mijenjati odgovore</li>
                  <li>• Možeš označiti pitanja za pregled (flag)</li>
                  <li>• Za prolaz trebaš najmanje {test.passingScore}%</li>
                  <li>• Test se automatski predaje kad vrijeme istekne</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => setTestStarted(true)}
              >
                Započni test
              </Button>
              <Button variant="outline" onClick={() => router.push('/tests')}>
                Odustani
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const currentAnswer = answers[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Pitanja</h3>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2 mb-4">
                {questions.map((_, index) => {
                  const status = getAnswerStatus(index)
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionJump(index)}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                        currentQuestion === index
                          ? 'bg-primary-600 text-white ring-2 ring-primary-300'
                          : status === 'answered'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : status === 'flagged'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span className="text-gray-600">Odgovoreno ({answeredCount})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                  <span className="text-gray-600">Označeno ({flaggedCount})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span className="text-gray-600">Bez odgovora</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowSubmitConfirm(true)}
                >
                  Predaj test
                </Button>
              </div>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {currentQ.topic}
                  </Badge>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pitanje {currentQuestion + 1} od {questions.length}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{currentQ.points} bodova</span>
                  <Button
                    variant={currentAnswer?.flagged ? 'warning' : 'ghost'}
                    size="sm"
                    icon={<Flag className="w-4 h-4" />}
                    onClick={handleToggleFlag}
                  >
                    {currentAnswer?.flagged ? 'Označeno' : 'Označi'}
                  </Button>
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <p className="text-lg text-gray-900 mb-6">{currentQ.question}</p>

                {/* Multiple Choice */}
                {currentQ.type === 'multiple-choice' && currentQ.options && (
                  <div className="space-y-3">
                    {currentQ.options.map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          currentAnswer?.answer === index
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          checked={currentAnswer?.answer === index}
                          onChange={() => handleAnswerChange(index)}
                          className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {currentQ.type === 'true-false' && (
                  <div className="space-y-3">
                    {['true', 'false'].map((option) => (
                      <label
                        key={option}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          currentAnswer?.answer === option
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          checked={currentAnswer?.answer === option}
                          onChange={() => handleAnswerChange(option)}
                          className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-gray-900 font-medium">
                          {option === 'true' ? 'Točno' : 'Netočno'}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Open-ended */}
                {currentQ.type === 'open-ended' && (
                  <textarea
                    value={(currentAnswer?.answer as string) || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Unesi svoj odgovor ovdje..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={8}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  icon={<ChevronLeft className="w-5 h-5" />}
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Prethodno
                </Button>
                <div className="text-sm text-gray-600">
                  {currentQuestion + 1} / {questions.length}
                </div>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={currentQuestion === questions.length - 1}
                >
                  Sljedeće
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Predaj test?</h3>
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Jesi li siguran/a da želiš predati test? Nećeš moći mijenjati odgovore nakon
                  predaje.
                </p>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Odgovoreno</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {answeredCount}/{questions.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Označeno</p>
                    <p className="text-2xl font-bold text-yellow-600">{flaggedCount}</p>
                  </div>
                </div>
                {answeredCount < questions.length && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Nisi odgovorio/la na {questions.length - answeredCount} pitanja
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowSubmitConfirm(false)}>
                  Odustani
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleSubmitTest}>
                  Potvrdi predaju
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
