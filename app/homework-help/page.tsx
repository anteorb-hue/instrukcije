'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
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
  Filter,
  Image as ImageIcon,
  FileText,
  Zap,
  User,
  Award,
  ThumbsUp,
  Share2,
  Download,
  X,
  Loader2,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HomeworkHelpPage() {
  const [showAskModal, setShowAskModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [newQuestion, setNewQuestion] = useState({
    subjectId: '',
    title: '',
    description: '',
    urgency: 'NORMAL' as 'LOW' | 'NORMAL' | 'URGENT',
  })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'OPEN' | 'ANSWERED'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Build API query params
  const params = new URLSearchParams()
  if (searchQuery) params.append('search', searchQuery)
  if (filter !== 'all') params.append('status', filter)
  params.append('limit', '50')

  // Fetch questions from API
  const { data, error, isLoading, mutate } = useSWR(
    `/api/homework?${params.toString()}`,
    fetcher
  )

  // Fetch subjects for filter
  const { data: subjectsData } = useSWR('/api/subjects', fetcher)

  // Fetch selected question details
  const { data: questionDetails } = useSWR(
    selectedQuestion ? `/api/homework/${selectedQuestion}` : null,
    fetcher
  )

  const questions = data?.questions || []
  const subjects = subjectsData || []

  const stats = {
    totalQuestions: data?.total || 0,
    answered: questions.filter((q: any) => q.status === 'ANSWERED').length,
    averageResponseTime: 5, // TODO: Calculate from actual data
    helpfulAnswers: 0, // TODO: Calculate from votes
  }

  const handleAskQuestion = async () => {
    if (!newQuestion.subjectId || !newQuestion.title || !newQuestion.description) {
      toast.error('Molimo ispunite sva polja')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: newQuestion.subjectId,
          title: newQuestion.title,
          description: newQuestion.description,
          urgency: newQuestion.urgency,
          imageUrl: uploadedImage || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create question')
      }

      toast.success('Pitanje poslano! Instruktor će odgovoriti uskoro.')
      setShowAskModal(false)
      setNewQuestion({ subjectId: '', title: '', description: '', urgency: 'NORMAL' })
      setUploadedImage(null)
      mutate() // Refresh questions list
    } catch (error) {
      console.error('Error creating question:', error)
      toast.error('Greška pri slanju pitanja. Pokušajte ponovno.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Upload to Cloudinary in production
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
        toast.success('Slika dodana')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVoteAnswer = async (answerId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    try {
      await fetch(`/api/homework/answers/${answerId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
      })
      toast.success('Hvala na povratnoj informaciji!')
      mutate()
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Greška pri glasanju')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ANSWERED':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Odgovoreno
          </Badge>
        )
      case 'IN_PROGRESS':
        return (
          <Badge variant="info">
            <Clock className="w-3 h-3 mr-1" />
            U tijeku
          </Badge>
        )
      case 'OPEN':
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3 mr-1" />
            Čeka se
          </Badge>
        )
      case 'CLOSED':
        return (
          <Badge variant="secondary">
            Zatvoreno
          </Badge>
        )
    }
  }

  const getUrgencyLabel = (urgency: string) => {
    const labels: Record<string, string> = {
      LOW: 'Nisko',
      NORMAL: 'Normalno',
      URGENT: 'Hitno',
    }
    return labels[urgency] || urgency
  }

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
              onClick={() => setFilter('OPEN')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                filter === 'OPEN'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Čeka se
            </button>
            <button
              onClick={() => setFilter('ANSWERED')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                filter === 'ANSWERED'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Odgovoreno
            </button>
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
            <p className="text-lg text-red-600">Greška pri učitavanju pitanja</p>
            <p className="text-sm text-gray-500 mt-2">Molimo pokušajte ponovno</p>
          </Card>
        )}

        {/* Questions List */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map((question: any) => (
                <Card
                  key={question.id}
                  hover
                  className="cursor-pointer"
                  onClick={() => setSelectedQuestion(question.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {question.subject && (
                          <Badge variant="info">{question.subject.name}</Badge>
                        )}
                        {getStatusBadge(question.status)}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{question.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {question.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(question.createdAt).toLocaleString('hr-HR')}
                        </div>
                        {question.tutor && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {question.tutor.name}
                          </div>
                        )}
                        {question._count?.answers > 0 && (
                          <div className="flex items-center text-green-600">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {question._count.answers} odgovora
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
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
          </div>
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
                value={newQuestion.subjectId}
                onChange={(e) => setNewQuestion({ ...newQuestion, subjectId: e.target.value })}
              >
                <option value="">Odaberi predmet</option>
                {subjects.map((subject: any) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naslov pitanja <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                placeholder="Kratki naslov pitanja..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis pitanja <span className="text-red-500">*</span>
              </label>
              <textarea
                className="input-field"
                rows={5}
                value={newQuestion.description}
                onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
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
                {(['LOW', 'NORMAL', 'URGENT'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setNewQuestion({ ...newQuestion, urgency: level })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      newQuestion.urgency === level
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {getUrgencyLabel(level)}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Šaljem...' : 'Pošalji pitanje'}
            </Button>
          </div>
        </Modal>

        {/* Question Detail Modal */}
        <Modal
          isOpen={!!selectedQuestion && !!questionDetails}
          onClose={() => setSelectedQuestion(null)}
          title="Detalji pitanja"
        >
          {questionDetails && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  {questionDetails.subject && (
                    <Badge variant="info">{questionDetails.subject.name}</Badge>
                  )}
                  {getStatusBadge(questionDetails.status)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {questionDetails.title}
                </h3>
                <p className="text-gray-700 mb-3">{questionDetails.description}</p>
                <p className="text-sm text-gray-600">
                  Postavljeno: {new Date(questionDetails.createdAt).toLocaleString('hr-HR')}
                </p>
              </div>

              {questionDetails.imageUrl && (
                <div>
                  <img
                    src={questionDetails.imageUrl}
                    alt="Question"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {questionDetails.answers && questionDetails.answers.length > 0 ? (
                questionDetails.answers.map((answer: any) => (
                  <div key={answer.id}>
                    {answer.tutor && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                              {answer.tutor.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{answer.tutor.name}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(answer.createdAt).toLocaleString('hr-HR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        Odgovor
                      </h4>
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                        <p className="text-gray-800">{answer.answer}</p>
                      </div>

                      {answer.stepsJson && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Koraci rješenja:</h5>
                          <ol className="space-y-3">
                            {JSON.parse(answer.stepsJson).map((step: string, idx: number) => (
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
                          <Button
                            variant="primary"
                            icon={<ThumbsUp className="w-4 h-4" />}
                            onClick={() => handleVoteAnswer(answer.id, 'UPVOTE')}
                          >
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
                  </div>
                ))
              ) : (
                <>
                  {questionDetails.status === 'OPEN' && (
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

                  {questionDetails.status === 'IN_PROGRESS' && (
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
                </>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}
