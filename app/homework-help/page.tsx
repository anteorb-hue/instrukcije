'use client'

import React, { useState } from 'react'
import {
  MessageCircle,
  Upload,
  Camera,
  Send,
  Clock,
  CheckCircle,
  Star,
  Bookmark,
  Search,
  Image as ImageIcon,
  FileText,
  Zap,
  User,
  ThumbsUp,
  Share2,
  X,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'

interface Question {
  id: string
  studentId: string
  subject: string
  question: string
  image?: string
  createdAt: Date
  status: 'pending' | 'answered' | 'in_progress'
  tutor?: {
    id: string
    name: string
    avatar?: string
    rating: number
  }
  answer?: {
    text: string
    images?: string[]
    steps?: string[]
    answeredAt: Date
  }
  saved: boolean
  helpful?: boolean
  responseTime?: number // in minutes
}

export default function HomeworkHelpPage() {
  const [showAskModal, setShowAskModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [newQuestion, setNewQuestion] = useState({
    subject: '',
    question: '',
    urgency: 'normal' as 'low' | 'normal' | 'urgent',
  })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const questions: Question[] = [
    {
      id: '1',
      studentId: 'student-1',
      subject: 'Matematika',
      question: 'Kako riješiti ovu kvadratnu jednadžbu: x² + 5x + 6 = 0?',
      createdAt: new Date('2025-01-16T10:30:00'),
      status: 'answered',
      tutor: {
        id: 'tutor-1',
        name: 'Ana Horvat',
        rating: 4.9,
      },
      answer: {
        text: 'Ovu kvadratnu jednadžbu možemo riješiti faktoriranjem ili kvadratnom formulom.',
        steps: [
          'Prepoznajemo kvadratnu jednadžbu u obliku ax² + bx + c = 0',
          'U ovom slučaju: a=1, b=5, c=6',
          'Faktoriramo: (x + 2)(x + 3) = 0',
          'Rješenja su: x₁ = -2 i x₂ = -3',
          'Provjera: (-2)² + 5(-2) + 6 = 4 - 10 + 6 = 0 ✓',
        ],
        answeredAt: new Date('2025-01-16T10:35:00'),
      },
      saved: true,
      helpful: true,
      responseTime: 5,
    },
    {
      id: '2',
      studentId: 'student-1',
      subject: 'Engleski jezik',
      question:
        'Koja je razlika između Present Perfect i Past Simple? Možete li dati primjere?',
      createdAt: new Date('2025-01-15T14:20:00'),
      status: 'answered',
      tutor: {
        id: 'tutor-2',
        name: 'Marko Novak',
        rating: 5.0,
      },
      answer: {
        text: 'Odličo pitanje! Evo glavnih razlika:',
        steps: [
          'Present Perfect: Koristi se za radnje koje su počele u prošlosti i traju do sada, ili imaju vezu s sadašnjošću.',
          'Primjer PP: "I have lived in Zagreb for 5 years" (još uvijek živim ovdje)',
          'Past Simple: Koristi se za radnje koje su završene u određenom trenutku u prošlosti.',
          'Primjer PS: "I lived in Split in 2010" (više ne živim tamo)',
          'Ključna razlika: PP povezuje prošlost sa sadašnjošću, PS je zatvorena radnja.',
        ],
        answeredAt: new Date('2025-01-15T14:25:00'),
      },
      saved: true,
      helpful: true,
      responseTime: 5,
    },
    {
      id: '3',
      studentId: 'student-1',
      subject: 'Programiranje',
      question: 'Što je razlika između let, const i var u JavaScriptu?',
      createdAt: new Date('2025-01-16T09:00:00'),
      status: 'in_progress',
      tutor: {
        id: 'tutor-3',
        name: 'Petra Kovačić',
        rating: 4.8,
      },
      saved: false,
      responseTime: undefined,
    },
    {
      id: '4',
      studentId: 'student-1',
      subject: 'Fizika',
      question: 'Kako izračunati silu trenja ako znam masu i koeficijent trenja?',
      createdAt: new Date('2025-01-16T11:00:00'),
      status: 'pending',
      saved: false,
    },
  ]

  const stats = {
    totalQuestions: questions.length,
    answered: questions.filter((q) => q.status === 'answered').length,
    averageResponseTime: 5,
    helpfulAnswers: questions.filter((q) => q.helpful).length,
  }

  const subjects = [
    'Matematika',
    'Fizika',
    'Kemija',
    'Biologija',
    'Engleski jezik',
    'Hrvatski jezik',
    'Programiranje',
    'Ekonomija',
    'Povijest',
    'Geografija',
  ]

  const handleAskQuestion = () => {
    if (!newQuestion.subject || !newQuestion.question) {
      toast.error('Molimo ispunite sva polja')
      return
    }

    // In production, this would send to the backend
    toast.success('Pitanje poslano! Instruktor će odgovoriti uskoro.')
    setShowAskModal(false)
    setNewQuestion({ subject: '', question: '', urgency: 'normal' })
    setUploadedImage(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In production, upload to server
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
        toast.success('Slika dodana')
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredQuestions = questions.filter((q) => {
    const matchesFilter = filter === 'all' || q.status === filter
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusBadge = (status: Question['status']) => {
    switch (status) {
      case 'answered':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Odgovoreno
          </Badge>
        )
      case 'in_progress':
        return (
          <Badge variant="info">
            <Clock className="w-3 h-3 mr-1" />
            U tijeku
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3 mr-1" />
            Čeka se
          </Badge>
        )
    }
  }

  const selectedQuestionData = questions.find((q) => q.id === selectedQuestion)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Brza pomoć s domaćom zadaćom
          </h1>
          <p className="text-gray-600">
            Postavi pitanje i dobij odgovor od stručnog instruktora u nekoliko minuta
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <MessageCircle className="w-8 h-8 text-primary-600 mb-2" />
              <p className="text-2xl font-bold text-gradient">{stats.totalQuestions}</p>
              <p className="text-sm text-gray-600">Ukupno pitanja</p>
            </div>
          </Card>
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.answered}</p>
              <p className="text-sm text-gray-600">Odgovoreno</p>
            </div>
          </Card>
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <Zap className="w-8 h-8 text-yellow-600 mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{stats.averageResponseTime} min</p>
              <p className="text-sm text-gray-600">Prosj. vrijeme</p>
            </div>
          </Card>
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <ThumbsUp className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">{stats.helpfulAnswers}</p>
              <p className="text-sm text-gray-600">Korisni odgovori</p>
            </div>
          </Card>
        </div>

        {/* CTA Button */}
        <div className="mb-8">
          <Button
            variant="primary"
            size="lg"
            className="w-full md:w-auto"
            icon={<MessageCircle className="w-5 h-5" />}
            onClick={() => setShowAskModal(true)}
          >
            Postavi novo pitanje
          </Button>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Input
            placeholder="Pretraži pitanja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Sva pitanja
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Čeka se
            </button>
            <button
              onClick={() => setFilter('answered')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                filter === 'answered'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Odgovoreno
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card
              key={question.id}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedQuestion(question.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="info">{question.subject}</Badge>
                    {getStatusBadge(question.status)}
                    {question.saved && (
                      <Bookmark className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{question.question}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {question.createdAt.toLocaleString('hr-HR')}
                    </div>
                    {question.tutor && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {question.tutor.name}
                      </div>
                    )}
                    {question.responseTime && (
                      <div className="flex items-center text-green-600">
                        <Zap className="w-4 h-4 mr-1" />
                        Odgovoreno za {question.responseTime} min
                      </div>
                    )}
                  </div>
                </div>
                {question.status === 'answered' && question.tutor && (
                  <div className="flex items-center space-x-2 ml-4">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{question.tutor.rating}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <Card className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Nema pronađenih pitanja</p>
            <p className="text-sm text-gray-500 mb-6">
              Postavi svoje prvo pitanje i dobij brzi odgovor
            </p>
            <Button variant="primary" onClick={() => setShowAskModal(true)}>
              Postavi pitanje
            </Button>
          </Card>
        )}

        {/* Ask Question Modal */}
        <Modal
          isOpen={showAskModal}
          onClose={() => {
            setShowAskModal(false)
            setUploadedImage(null)
          }}
          title="Postavi pitanje"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Predmet <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={newQuestion.subject}
                onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
              >
                <option value="">Odaberi predmet</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tvoje pitanje <span className="text-red-500">*</span>
              </label>
              <textarea
                className="input-field"
                rows={5}
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Opiši detaljno svoje pitanje..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dodaj sliku (opciono)
              </label>
              <div className="flex space-x-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Klikni za upload</p>
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 transition-colors">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Fotografiraj</p>
                  </div>
                </label>
              </div>
              {uploadedImage && (
                <div className="mt-3 relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hitnost</label>
              <div className="flex space-x-2">
                {(['low', 'normal', 'urgent'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setNewQuestion({ ...newQuestion, urgency: level })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      newQuestion.urgency === level
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {level === 'low' ? 'Nisko' : level === 'normal' ? 'Normalno' : 'Hitno'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start">
                <Zap className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">Brzi odgovor garantiran!</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Prosječno vrijeme odgovora: 5 minuta
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleAskQuestion}
              icon={<Send className="w-4 h-4" />}
            >
              Pošalji pitanje
            </Button>
          </div>
        </Modal>

        {/* Question Detail Modal */}
        <Modal
          isOpen={!!selectedQuestion && !!selectedQuestionData}
          onClose={() => setSelectedQuestion(null)}
          title="Detalji pitanja"
        >
          {selectedQuestionData && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="info">{selectedQuestionData.subject}</Badge>
                  {getStatusBadge(selectedQuestionData.status)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedQuestionData.question}
                </h3>
                <p className="text-sm text-gray-600">
                  Postavljeno: {selectedQuestionData.createdAt.toLocaleString('hr-HR')}
                </p>
              </div>

              {selectedQuestionData.image && (
                <div>
                  <img
                    src={selectedQuestionData.image}
                    alt="Question"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {selectedQuestionData.tutor && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                        {selectedQuestionData.tutor.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedQuestionData.tutor.name}
                        </p>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm text-gray-600">
                            {selectedQuestionData.tutor.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedQuestionData.responseTime && (
                      <Badge variant="success">
                        Odgovoreno za {selectedQuestionData.responseTime} min
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {selectedQuestionData.answer && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Odgovor
                  </h4>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                    <p className="text-gray-800">{selectedQuestionData.answer.text}</p>
                  </div>

                  {selectedQuestionData.answer.steps && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Koraci rješenja:</h5>
                      <ol className="space-y-3">
                        {selectedQuestionData.answer.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center mr-3">
                              {idx + 1}
                            </span>
                            <span className="text-gray-700 pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">Je li ti ovaj odgovor pomogao?</p>
                    <div className="flex space-x-3">
                      <Button variant="primary" icon={<ThumbsUp className="w-4 h-4" />}>
                        Koristan odgovor
                      </Button>
                      <Button variant="outline" icon={<Bookmark className="w-4 h-4" />}>
                        Spremi
                      </Button>
                      <Button variant="outline" icon={<Share2 className="w-4 h-4" />}>
                        Podijeli
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {selectedQuestionData.status === 'pending' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-900 font-medium">
                        Tvoje pitanje čeka na odgovor
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Instruktor će ti odgovoriti u najkraćem roku
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedQuestionData.status === 'in_progress' && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="flex items-start">
                    <MessageCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 font-medium">
                        Instruktor trenutno radi na odgovoru
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Odgovor će biti dostupan uskoro
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}
