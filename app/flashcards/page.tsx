'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Plus, Edit, Trash2, Check, X } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

interface Flashcard {
  id: string
  front: string
  back: string
  subject: string
  difficulty: 'easy' | 'medium' | 'hard'
  lastReviewed?: Date
  correct: number
  incorrect: number
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: '1',
      front: 'Što je derivacija funkcije?',
      back: 'Derivacija funkcije je mjera brzine promjene funkcije u odnosu na njenu varijablu.',
      subject: 'Matematika',
      difficulty: 'medium',
      correct: 5,
      incorrect: 2,
    },
    {
      id: '2',
      front: 'What is the Present Perfect tense?',
      back: 'Present Perfect: have/has + past participle. Used for actions that started in the past and continue to the present.',
      subject: 'Engleski',
      difficulty: 'easy',
      correct: 8,
      incorrect: 1,
    },
    {
      id: '3',
      front: 'Što je useState hook u React-u?',
      back: 'useState je React hook koji omogućuje dodavanje state-a u functional komponente.',
      subject: 'Programiranje',
      difficulty: 'medium',
      correct: 3,
      incorrect: 0,
    },
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [studyMode, setStudyMode] = useState(false)

  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    subject: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  })

  const subjects = Array.from(new Set(flashcards.map((card) => card.subject)))
  const filteredCards =
    selectedSubject === 'all'
      ? flashcards
      : flashcards.filter((card) => card.subject === selectedSubject)

  const currentCard = filteredCards[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleCorrect = () => {
    const updatedCards = flashcards.map((card) =>
      card.id === currentCard.id ? { ...card, correct: card.correct + 1 } : card
    )
    setFlashcards(updatedCards)
    toast.success('Točno!')
    setTimeout(handleNext, 500)
  }

  const handleIncorrect = () => {
    const updatedCards = flashcards.map((card) =>
      card.id === currentCard.id ? { ...card, incorrect: card.incorrect + 1 } : card
    )
    setFlashcards(updatedCards)
    toast.error('Krivo, pokušaj ponovno!')
    setTimeout(handleNext, 500)
  }

  const handleCreateCard = () => {
    if (!newCard.front || !newCard.back || !newCard.subject) {
      toast.error('Ispunite sva polja')
      return
    }

    const card: Flashcard = {
      id: Date.now().toString(),
      ...newCard,
      correct: 0,
      incorrect: 0,
    }

    setFlashcards([...flashcards, card])
    setNewCard({ front: '', back: '', subject: '', difficulty: 'medium' })
    setShowCreateModal(false)
    toast.success('Flashcard kreiran!')
  }

  const stats = {
    total: flashcards.length,
    mastered: flashcards.filter((c) => c.correct >= 5).length,
    learning: flashcards.filter((c) => c.correct < 5 && c.correct > 0).length,
    new: flashcards.filter((c) => c.correct === 0).length,
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flashcards</h1>
          <p className="text-gray-600">Vježbaj i memoriraj s flashcards sustavom</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <p className="text-2xl font-bold text-gradient">{stats.total}</p>
            <p className="text-sm text-gray-600">Ukupno</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.mastered}</p>
            <p className="text-sm text-gray-600">Naučeno</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.learning}</p>
            <p className="text-sm text-gray-600">Učim</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            <p className="text-sm text-gray-600">Novo</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedSubject === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Svi predmeti
            </button>
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSubject === subject
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
            Novi flashcard
          </Button>
        </div>

        {filteredCards.length > 0 ? (
          <>
            {/* Main Flashcard */}
            <div className="relative mb-8" style={{ perspective: '1000px' }}>
              <div
                className={`relative w-full transition-transform duration-500 cursor-pointer ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                  minHeight: '400px',
                }}
                onClick={handleFlip}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Card className="h-full flex flex-col items-center justify-center p-8 text-center gradient-bg text-white min-h-[400px]">
                    <Badge variant="default" className="mb-4 bg-white/20 text-white">
                      {currentCard.subject}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-4">{currentCard.front}</h2>
                    <p className="text-white/80 text-sm">Klikni za odgovor</p>
                  </Card>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <Card className="h-full flex flex-col items-center justify-center p-8 text-center bg-white min-h-[400px]">
                    <Badge variant="info" className="mb-4">
                      Odgovor
                    </Badge>
                    <p className="text-2xl text-gray-900 mb-8">{currentCard.back}</p>
                    {studyMode && (
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="danger"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleIncorrect()
                          }}
                          icon={<X className="w-5 h-5" />}
                        >
                          Krivo
                        </Button>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCorrect()
                          }}
                          icon={<Check className="w-5 h-5" />}
                        >
                          Točno
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-8">
              <Button variant="outline" onClick={handlePrevious} icon={<ChevronLeft className="w-5 h-5" />}>
                Prethodni
              </Button>

              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {currentIndex + 1} / {filteredCards.length}
                </span>
                <button
                  onClick={() => {
                    setCurrentIndex(0)
                    setIsFlipped(false)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={studyMode}
                    onChange={(e) => setStudyMode(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Study mode</span>
                </label>
              </div>

              <Button variant="outline" onClick={handleNext} icon={<ChevronRight className="w-5 h-5" />}>
                Sljedeći
              </Button>
            </div>

            {/* Progress */}
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Napredak za ovaj flashcard</span>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">✓ {currentCard.correct}</span>
                  <span className="text-red-600">✗ {currentCard.incorrect}</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{
                    width: `${
                      (currentCard.correct / (currentCard.correct + currentCard.incorrect || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </Card>
          </>
        ) : (
          <Card className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Nema flashcarda za odabrani predmet</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Kreiraj prvi flashcard
            </Button>
          </Card>
        )}

        {/* Create Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Novi Flashcard"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Predmet</label>
              <select
                className="input-field"
                value={newCard.subject}
                onChange={(e) => setNewCard({ ...newCard, subject: e.target.value })}
              >
                <option value="">Odaberi predmet</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
                <option value="novo">+ Novi predmet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pitanje (Front)</label>
              <textarea
                className="input-field"
                rows={3}
                value={newCard.front}
                onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                placeholder="Unesite pitanje..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Odgovor (Back)</label>
              <textarea
                className="input-field"
                rows={3}
                value={newCard.back}
                onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                placeholder="Unesite odgovor..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Težina</label>
              <div className="flex space-x-2">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setNewCard({ ...newCard, difficulty: level })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      newCard.difficulty === level
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {level === 'easy' ? 'Lako' : level === 'medium' ? 'Srednje' : 'Teško'}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="primary" className="w-full" onClick={handleCreateCard}>
              Kreiraj Flashcard
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
