'use client'

import React, { useState } from 'react'
import {
  Users,
  Plus,
  Lock,
  Globe,
  Clock,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Settings,
  LogOut,
  Coffee,
  Target,
  TrendingUp,
  Flame,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'

interface StudyRoom {
  id: string
  name: string
  description: string
  subject: string
  host: {
    id: string
    name: string
    avatar?: string
  }
  participants: number
  maxParticipants: number
  isPublic: boolean
  hasPassword: boolean
  sessionLength: number
  breakLength: number
  currentCycle: number
  totalCycles: number
  isActive: boolean
  createdAt: Date
}

interface Participant {
  id: string
  name: string
  avatar?: string
  status: 'studying' | 'break' | 'away'
  joinedAt: Date
  studyTime: number
}

export default function StudyRoomsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)

  // Mock data
  const studyRooms: StudyRoom[] = [
    {
      id: 'room-1',
      name: 'Priprema za maturu - Matematika',
      description: 'Zajednička priprema za državnu maturu, rješavamo zadatke i međusobno si pomažemo',
      subject: 'Matematika',
      host: {
        id: 'u1',
        name: 'Ana Horvat',
      },
      participants: 8,
      maxParticipants: 15,
      isPublic: true,
      hasPassword: false,
      sessionLength: 50,
      breakLength: 10,
      currentCycle: 2,
      totalCycles: 4,
      isActive: true,
      createdAt: new Date('2025-01-16T14:00:00'),
    },
    {
      id: 'room-2',
      name: 'React.js Dev Session',
      description: 'Radimo na projektima, pair programming i code review',
      subject: 'Programiranje',
      host: {
        id: 'u2',
        name: 'Marko Novak',
      },
      participants: 12,
      maxParticipants: 20,
      isPublic: true,
      hasPassword: false,
      sessionLength: 45,
      breakLength: 15,
      currentCycle: 1,
      totalCycles: 6,
      isActive: true,
      createdAt: new Date('2025-01-16T15:30:00'),
    },
    {
      id: 'room-3',
      name: 'Engleski - Konverzacija',
      description: 'Vježbamo speaking i vocabulary kroz casual razgovor',
      subject: 'Engleski jezik',
      host: {
        id: 'u3',
        name: 'Petra Kovačić',
      },
      participants: 5,
      maxParticipants: 10,
      isPublic: false,
      hasPassword: true,
      sessionLength: 30,
      breakLength: 5,
      currentCycle: 3,
      totalCycles: 4,
      isActive: true,
      createdAt: new Date('2025-01-16T16:00:00'),
    },
    {
      id: 'room-4',
      name: 'Silent Study - Pomodoro',
      description: 'Tiha soba za fokusirano učenje, bez razgovora',
      subject: 'Razno',
      host: {
        id: 'u4',
        name: 'Ivan Petrović',
      },
      participants: 15,
      maxParticipants: 30,
      isPublic: true,
      hasPassword: false,
      sessionLength: 25,
      breakLength: 5,
      currentCycle: 4,
      totalCycles: 8,
      isActive: true,
      createdAt: new Date('2025-01-16T13:00:00'),
    },
  ]

  const participants: Participant[] = [
    {
      id: 'p1',
      name: 'Ana Horvat',
      status: 'studying',
      joinedAt: new Date('2025-01-16T14:00:00'),
      studyTime: 120,
    },
    {
      id: 'p2',
      name: 'Marko Marić',
      status: 'studying',
      joinedAt: new Date('2025-01-16T14:15:00'),
      studyTime: 105,
    },
    {
      id: 'p3',
      name: 'Petra Jurić',
      status: 'break',
      joinedAt: new Date('2025-01-16T14:20:00'),
      studyTime: 95,
    },
    {
      id: 'p4',
      name: 'Ivan Novak',
      status: 'studying',
      joinedAt: new Date('2025-01-16T14:30:00'),
      studyTime: 85,
    },
    {
      id: 'p5',
      name: 'Laura Babić',
      status: 'away',
      joinedAt: new Date('2025-01-16T14:35:00'),
      studyTime: 75,
    },
  ]

  const stats = {
    totalRooms: studyRooms.length,
    activeParticipants: studyRooms.reduce((sum, r) => sum + r.participants, 0),
    yourStudyTime: 245, // minutes today
    streak: 7, // days
  }

  const handleJoinRoom = (roomId: string) => {
    setSelectedRoom(roomId)
    alert('Pridružio/la si se sobi!')
  }

  const handleCreateRoom = () => {
    setShowCreateModal(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'studying':
        return 'bg-green-500'
      case 'break':
        return 'bg-yellow-500'
      case 'away':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'studying':
        return 'Uči'
      case 'break':
        return 'Pauza'
      case 'away':
        return 'Odsutan/a'
      default:
        return 'Nepoznato'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Rooms</h1>
          <p className="text-gray-600">
            Uči zajedno s drugima, ostani fokusiran i postiži više
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalRooms}</p>
            <p className="text-sm text-gray-600">Aktivnih soba</p>
          </Card>
          <Card className="text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.activeParticipants}</p>
            <p className="text-sm text-gray-600">Polaznika online</p>
          </Card>
          <Card className="text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{formatDuration(stats.yourStudyTime)}</p>
            <p className="text-sm text-gray-600">Danas</p>
          </Card>
          <Card className="text-center">
            <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.streak}</p>
            <p className="text-sm text-gray-600">Dana zaredom</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Study Rooms List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Dostupne sobe</h2>
              <Button
                variant="primary"
                icon={<Plus className="w-5 h-5" />}
                onClick={handleCreateRoom}
              >
                Kreiraj sobu
              </Button>
            </div>

            <div className="space-y-4">
              {studyRooms.map((room) => (
                <Card key={room.id} hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                        {room.isPublic ? (
                          <Globe className="w-4 h-4 text-green-600" title="Javna soba" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-600" title="Privatna soba" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                      <Badge variant="secondary">{room.subject}</Badge>
                    </div>
                  </div>

                  {/* Room Info */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>
                        {room.participants}/{room.maxParticipants} polaznika
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {room.sessionLength}m / {room.breakLength}m pauza
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2" />
                      <span>
                        Ciklus {room.currentCycle}/{room.totalCycles}
                      </span>
                    </div>
                  </div>

                  {/* Host */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Avatar src={room.host.avatar} name={room.host.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{room.host.name}</p>
                        <p className="text-xs text-gray-500">Host</p>
                      </div>
                    </div>
                    <Button
                      variant={room.participants >= room.maxParticipants ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={room.participants >= room.maxParticipants}
                    >
                      {room.participants >= room.maxParticipants ? 'Popunjeno' : 'Pridruži se'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Pomodoro Timer & Participants */}
          <div className="space-y-6">
            {/* Pomodoro Timer */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Pomodoro Timer</h3>
              <div className="text-center mb-6">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                  <div className="w-44 h-44 bg-white rounded-full flex items-center justify-center">
                    <p className="text-5xl font-bold text-gray-900">
                      {formatTime(pomodoroTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {isBreak ? (
                    <Badge variant="warning" className="text-base px-4 py-2">
                      <Coffee className="w-4 h-4 mr-2" />
                      Pauza
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-base px-4 py-2">
                      <Target className="w-4 h-4 mr-2" />
                      Fokus
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Ciklusi završeni danas: <strong>{cyclesCompleted}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={isTimerRunning ? 'warning' : 'primary'}
                  className="flex-1"
                  icon={isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? 'Pauziraj' : 'Pokreni'}
                </Button>
                <Button
                  variant="outline"
                  icon={<RotateCcw className="w-5 h-5" />}
                  onClick={() => {
                    setPomodoroTime(25 * 60)
                    setIsTimerRunning(false)
                  }}
                >
                  Reset
                </Button>
              </div>
            </Card>

            {/* Active Participants (if in room) */}
            {selectedRoom && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Polaznici ({participants.length})
                </h3>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar src={participant.avatar} name={participant.name} size="sm" />
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                              participant.status
                            )}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                          <p className="text-xs text-gray-500">
                            {getStatusLabel(participant.status)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{formatDuration(participant.studyTime)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-12 gradient-bg text-white">
          <div className="flex items-start space-x-4">
            <Target className="w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Pomodoro tehnika</h3>
              <p className="mb-4 opacity-90">
                Pomodoro tehnika je metoda upravljanja vremenom koja koristi timer za dijeljenje rada u intervale, tradicionalno 25 minuta, razdvojene kratkim pauzama.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-xs font-semibold">
                    1
                  </div>
                  <span>Odaberi zadatak koji želiš riješiti</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-xs font-semibold">
                    2
                  </div>
                  <span>Postavi timer na 25 minuta i radi fokusirano</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-xs font-semibold">
                    3
                  </div>
                  <span>Kad timer zazvoni, napravi pauzu od 5 minuta</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-xs font-semibold">
                    4
                  </div>
                  <span>Nakon 4 ciklusa, napravi dulju pauzu od 15-30 minuta</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
