'use client'

import React, { useState } from 'react'
import {
  Users,
  Calendar,
  Clock,
  Video,
  DollarSign,
  Star,
  MapPin,
  Share2,
  Bookmark,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Award,
  MessageSquare,
  Send,
  Play,
  Download,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Bell,
  Copy,
  Check,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { useRouter } from 'next/navigation'

interface GroupLessonDetailProps {
  params: { id: string }
}

interface Participant {
  id: string
  name: string
  avatar?: string
  joinedAt: Date
  isVerified: boolean
}

interface ChatMessage {
  id: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  message: string
  createdAt: Date
}

export default function GroupLessonDetailPage({ params }: GroupLessonDetailProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'details' | 'participants' | 'chat' | 'recordings'>('details')
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  // Mock data
  const lesson = {
    id: params.id,
    title: 'Priprema za maturu - Matematika',
    description:
      'Intenzivna grupna priprema za državnu maturu iz matematike. Pokrivamo sve ključne teme koje se pojavljuju na maturi: funkcije (linearne, kvadratne, eksponencijalne, logaritamske), derivacije i njihova primjena, integrale i primjenu u geometriji, vjerojatnost i statistiku. Lekcija uključuje detaljno objašnjenje teorije, rješavanje zadataka iz prošlih godina, te strategije za efikasno rješavanje zadataka na ispitu. Svaki polaznik dobiva materijale za vježbu i pristup snimci nakon lekcije.',
    subject: 'Matematika',
    tutor: {
      id: 'tutor-1',
      name: 'Ana Horvat',
      avatar: '',
      rating: 4.9,
      totalReviews: 156,
      completedLessons: 450,
      bio: 'Profesorica matematike s 10 godina iskustva u pripremi učenika za maturu. Specijalizirana za rad s učenicima koji imaju poteškoće s matematikom.',
    },
    startDate: new Date('2025-01-20T18:00:00'),
    duration: 90,
    maxParticipants: 15,
    currentParticipants: 12,
    pricePerPerson: 80,
    level: 'advanced',
    type: 'group-lesson' as const,
    hasRecording: true,
    tags: ['matura', 'matematika', 'priprema'],
    location: 'Online - Zoom',
    meetingLink: 'https://zoom.us/j/123456789',
    requirements: [
      'Stabilna internet veza',
      'Mikrofon i kamera (preporučeno)',
      'Bilježnica i olovka',
      'Udžbenik iz matematike (nije obavezno)',
    ],
    whatYouWillLearn: [
      'Svi tipovi funkcija i njihova svojstva',
      'Derivacije - pravila i primjena',
      'Integrali i površine ispod krivulja',
      'Vjerojatnost i kombinatorika',
      'Strategije rješavanja maturalnih zadataka',
      'Tipične greške i kako ih izbjeći',
    ],
    materials: [
      { id: '1', name: 'Skripta - Funkcije.pdf', size: '2.3 MB' },
      { id: '2', name: 'Zadaci - Derivacije.pdf', size: '1.8 MB' },
      { id: '3', name: 'Riješeni primjeri - Integrali.pdf', size: '3.1 MB' },
    ],
  }

  const participants: Participant[] = [
    {
      id: '1',
      name: 'Marko Marić',
      isVerified: true,
      joinedAt: new Date('2025-01-10'),
    },
    {
      id: '2',
      name: 'Petra Kovačić',
      isVerified: true,
      joinedAt: new Date('2025-01-11'),
    },
    {
      id: '3',
      name: 'Ivan Novak',
      isVerified: false,
      joinedAt: new Date('2025-01-12'),
    },
    {
      id: '4',
      name: 'Laura Babić',
      isVerified: true,
      joinedAt: new Date('2025-01-13'),
    },
    {
      id: '5',
      name: 'Luka Horvat',
      isVerified: true,
      joinedAt: new Date('2025-01-14'),
    },
    {
      id: '6',
      name: 'Maja Petrović',
      isVerified: false,
      joinedAt: new Date('2025-01-14'),
    },
    {
      id: '7',
      name: 'Tomislav Kovač',
      isVerified: true,
      joinedAt: new Date('2025-01-15'),
    },
    {
      id: '8',
      name: 'Ana Jurić',
      isVerified: true,
      joinedAt: new Date('2025-01-15'),
    },
    {
      id: '9',
      name: 'Filip Matić',
      isVerified: true,
      joinedAt: new Date('2025-01-15'),
    },
    {
      id: '10',
      name: 'Iva Blažević',
      isVerified: false,
      joinedAt: new Date('2025-01-16'),
    },
    {
      id: '11',
      name: 'Mateo Šimić',
      isVerified: true,
      joinedAt: new Date('2025-01-16'),
    },
    {
      id: '12',
      name: 'Lucija Vuković',
      isVerified: true,
      joinedAt: new Date('2025-01-16'),
    },
  ]

  const chatMessages: ChatMessage[] = [
    {
      id: '1',
      sender: { id: 'tutor-1', name: 'Ana Horvat (Instruktor)' },
      message: 'Dobrodošli svima! Ako imate bilo kakva pitanja prije lekcije, slobodno pitajte.',
      createdAt: new Date('2025-01-16T10:00:00'),
    },
    {
      id: '2',
      sender: { id: '1', name: 'Marko Marić' },
      message: 'Pozdrav! Hoćemo li raditi zadatke iz 2024. godine?',
      createdAt: new Date('2025-01-16T10:15:00'),
    },
    {
      id: '3',
      sender: { id: 'tutor-1', name: 'Ana Horvat (Instruktor)' },
      message: 'Da, pokrit ćemo zadatke iz 2024. i 2023. godine, plus najteže zadatke iz prijašnjih godina.',
      createdAt: new Date('2025-01-16T10:20:00'),
    },
    {
      id: '4',
      sender: { id: '2', name: 'Petra Kovačić' },
      message: 'Super! Jedva čekam 🙂',
      createdAt: new Date('2025-01-16T11:30:00'),
    },
  ]

  const recordings = [
    {
      id: '1',
      title: 'Prethodna sesija - 13.01.2025',
      duration: 85,
      views: 24,
      date: new Date('2025-01-13'),
    },
  ]

  const availableSpots = lesson.maxParticipants - lesson.currentParticipants
  const isFull = availableSpots === 0
  const isUpcoming = lesson.startDate > new Date()

  const handleJoinLesson = () => {
    if (isFull) {
      alert('Ova lekcija je popunjena. Možete se prijaviti na listu čekanja.')
      return
    }
    // Simulate joining
    setHasJoined(true)
    alert('Uspješno ste se prijavili! Detalji o plaćanju poslani su na vašu email adresu.')
  }

  const handleLeaveLesson = () => {
    if (confirm('Jeste li sigurni da želite otkazati prijavu?')) {
      setHasJoined(false)
      alert('Uspješno ste otkazali prijavu. Novac će vam biti vraćen u roku od 3-5 radnih dana.')
    }
  }

  const handleShareLesson = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    // Simulate sending message
    alert('Poruka poslana!')
    setChatMessage('')
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('hr-HR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('hr-HR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeUntilStart = () => {
    const now = new Date()
    const diff = lesson.startDate.getTime() - now.getTime()

    if (diff < 0) return 'Lekcija je završena'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `Počinje za ${days} dana`
    if (hours > 0) return `Počinje za ${hours} sati`
    return 'Počinje uskoro'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <button onClick={() => router.push('/group-lessons')} className="hover:text-primary-600">
            Grupne lekcije
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{lesson.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <Card className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant={lesson.type === 'webinar' ? 'info' : 'secondary'}>
                      {lesson.type === 'webinar' ? 'Webinar' : 'Grupna lekcija'}
                    </Badge>
                    <Badge variant="warning">{lesson.level === 'advanced' ? 'Napredni' : lesson.level === 'intermediate' ? 'Srednji' : 'Početnik'}</Badge>
                    {lesson.hasRecording && (
                      <Badge variant="success">
                        <Video className="w-3 h-3 mr-1" />
                        Snimka dostupna
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{lesson.title}</h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{lesson.subject}</span>
                    <span>•</span>
                    <span>{getTimeUntilStart()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={isBookmarked ? <Bookmark className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={linkCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                    onClick={handleShareLesson}
                  />
                </div>
              </div>

              {/* Tutor Info */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
                <Avatar src={lesson.tutor.avatar} name={lesson.tutor.name} size="lg" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{lesson.tutor.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium">{lesson.tutor.rating}</span>
                      <span className="ml-1">({lesson.tutor.totalReviews})</span>
                    </div>
                    <span>•</span>
                    <span>{lesson.tutor.completedLessons} održanih lekcija</span>
                  </div>
                  <p className="text-sm text-gray-700">{lesson.tutor.bio}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/tutors/${lesson.tutor.id}`)}
                >
                  Vidi profil
                </Button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">O lekciji</h3>
                <p className={`text-gray-700 leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                  {lesson.description}
                </p>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 flex items-center"
                >
                  {showFullDescription ? (
                    <>
                      Prikaži manje <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Prikaži više <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {lesson.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-3 border-b-2 font-medium transition-colors ${
                      activeTab === 'details'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Detalji
                  </button>
                  <button
                    onClick={() => setActiveTab('participants')}
                    className={`pb-3 border-b-2 font-medium transition-colors ${
                      activeTab === 'participants'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Polaznici ({participants.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`pb-3 border-b-2 font-medium transition-colors ${
                      activeTab === 'chat'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grupni chat
                  </button>
                  {lesson.hasRecording && (
                    <button
                      onClick={() => setActiveTab('recordings')}
                      className={`pb-3 border-b-2 font-medium transition-colors ${
                        activeTab === 'recordings'
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Snimke
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* What You'll Learn */}
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-primary-600" />
                    Što ćeš naučiti
                  </h3>
                  <ul className="space-y-3">
                    {lesson.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Requirements */}
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                    Što trebam za lekciju
                  </h3>
                  <ul className="space-y-3">
                    {lesson.requirements.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Materials */}
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                    Materijali za preuzimanje
                  </h3>
                  <div className="space-y-2">
                    {lesson.materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <Download className="w-5 h-5 text-gray-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{material.name}</p>
                            <p className="text-xs text-gray-500">{material.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Preuzmi
                        </Button>
                      </div>
                    ))}
                  </div>
                  {!hasJoined && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-900">
                        Materijali će biti dostupni nakon prijave na lekciju.
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {activeTab === 'participants' && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Polaznici ({participants.length}/{lesson.maxParticipants})
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Avatar src={participant.avatar} name={participant.name} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                          {participant.isVerified && (
                            <UserCheck className="w-4 h-4 text-green-600" title="Verificiran korisnik" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Pridružio se {formatDate(participant.joinedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {availableSpots > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-900">
                      <strong>{availableSpots}</strong> slobodno{availableSpots === 1 ? ' mjesto' : availableSpots < 5 ? ' mjesta' : ' mjesta'}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'chat' && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Grupni chat
                </h3>
                {hasJoined ? (
                  <>
                    <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="flex items-start space-x-3">
                          <Avatar src={msg.sender.avatar} name={msg.sender.name} size="sm" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-sm font-medium text-gray-900">{msg.sender.name}</p>
                              <span className="text-xs text-gray-500">{formatTime(msg.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-end space-x-2 pt-4 border-t border-gray-200">
                      <textarea
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Napiši poruku..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      <Button
                        variant="primary"
                        icon={<Send className="w-5 h-5" />}
                        onClick={handleSendMessage}
                        disabled={!chatMessage.trim()}
                      >
                        Pošalji
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Pridruži se lekciji za pristup chatu</p>
                    <p className="text-sm text-gray-500">
                      Chat je dostupan samo prijavljenim polaznicima
                    </p>
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'recordings' && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  Snimke prethodnih sesija
                </h3>
                {hasJoined ? (
                  <div className="space-y-4">
                    {recordings.map((recording) => (
                      <div
                        key={recording.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{recording.title}</p>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {recording.duration} min
                              </span>
                              <span>•</span>
                              <span>{recording.views} pregleda</span>
                              <span>•</span>
                              <span>{formatDate(recording.date)}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="primary" size="sm" icon={<Play className="w-4 h-4" />}>
                          Gledaj
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Snimke su dostupne nakon prijave</p>
                    <p className="text-sm text-gray-500">
                      Prijavi se na lekciju za pristup svim snimkama
                    </p>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              {/* Price & Spots */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <p className="text-3xl font-bold text-primary-600">{lesson.pricePerPerson} kn</p>
                    <p className="text-sm text-gray-500">po osobi</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Ukupno</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {lesson.pricePerPerson * lesson.maxParticipants} kn
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  {isFull ? (
                    <Badge variant="danger" className="w-full justify-center py-2">
                      <XCircle className="w-4 h-4 mr-2" />
                      Popunjeno
                    </Badge>
                  ) : (
                    <Badge
                      variant={availableSpots <= 3 ? 'warning' : 'success'}
                      className="w-full justify-center py-2"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {availableSpots} slobodno{availableSpots === 1 ? ' mjesto' : ' mjesta'}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Key Info */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Datum</p>
                    <p className="font-medium text-gray-900">{formatDate(lesson.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Vrijeme</p>
                    <p className="font-medium text-gray-900">
                      {formatTime(lesson.startDate)} ({lesson.duration} min)
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Lokacija</p>
                    <p className="font-medium text-gray-900">{lesson.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Polaznici</p>
                    <p className="font-medium text-gray-900">
                      {lesson.currentParticipants}/{lesson.maxParticipants}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {hasJoined ? (
                  <>
                    <Button variant="success" className="w-full" disabled>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Prijavljen/a
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleLeaveLesson}>
                      Otkaži prijavu
                    </Button>
                    {isUpcoming && (
                      <Button variant="primary" className="w-full">
                        <Bell className="w-5 h-5 mr-2" />
                        Dodaj podsjetnik
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={handleJoinLesson}
                      disabled={isFull}
                    >
                      {isFull ? 'Lista čekanja' : 'Prijavi se na lekciju'}
                    </Button>
                    {isFull && (
                      <p className="text-xs text-gray-500 text-center">
                        Bit ćeš obaviješten/a ako se oslobodi mjesto
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Uključeno u cijenu</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    90 minuta live lekcije
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    Pristup grupi i chatu
                  </li>
                  {lesson.hasRecording && (
                    <li className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      Snimka lekcije (30 dana)
                    </li>
                  )}
                  <li className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    Materijali za preuzimanje
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    Certifikat nakon završetka
                  </li>
                </ul>
              </div>

              {/* Refund Policy */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  💰 <strong>Garancija povrata novca:</strong> Možeš otkazati prijavu do 24h prije početka
                  i dobiti puni povrat novca.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
