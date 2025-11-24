'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MonitorUp,
  Settings,
  Users,
  MessageSquare,
  FileText,
  Upload,
  Download,
  Clock,
  Circle,
  Maximize2,
  Minimize2,
  Paintbrush,
  Camera,
  CameraOff,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import InteractiveWhiteboard from '@/components/whiteboard/InteractiveWhiteboard'
import toast from 'react-hot-toast'

interface Participant {
  id: string
  name: string
  role: 'tutor' | 'student'
  avatar?: string
  isVideoOn: boolean
  isAudioOn: boolean
  isOnline: boolean
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
  type: 'text' | 'file'
  fileUrl?: string
  fileName?: string
}

interface SessionData {
  id: string
  subject: string
  tutor: {
    id: string
    name: string
    avatar?: string
  }
  student: {
    id: string
    name: string
    avatar?: string
  }
  startTime: Date
  duration: number
  videoProvider: 'zoom' | 'meet' | 'teams'
  meetingUrl: string
  status: 'scheduled' | 'ongoing' | 'completed'
}

export default function SessionRoomPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'video' | 'whiteboard' | 'chat' | 'files'>(
    'video'
  )
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showParticipants, setShowParticipants] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sessionTime, setSessionTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Mock data - in production, fetch from API
  const sessionData: SessionData = {
    id: params.id,
    subject: 'Matematika - Derivacije',
    tutor: {
      id: 'tutor-1',
      name: 'Ana Horvat',
    },
    student: {
      id: 'student-1',
      name: 'Marko Marić',
    },
    startTime: new Date(),
    duration: 60,
    videoProvider: 'zoom',
    meetingUrl: 'https://zoom.us/j/123456789',
    status: 'ongoing',
  }

  const participants: Participant[] = [
    {
      id: 'tutor-1',
      name: 'Ana Horvat',
      role: 'tutor',
      isVideoOn: true,
      isAudioOn: true,
      isOnline: true,
    },
    {
      id: 'student-1',
      name: 'Marko Marić',
      role: 'student',
      isVideoOn: true,
      isAudioOn: true,
      isOnline: true,
    },
  ]

  const sharedFiles = [
    {
      id: '1',
      name: 'Derivacije - Prezentacija.pdf',
      size: '2.4 MB',
      uploadedBy: 'Ana Horvat',
      uploadedAt: new Date('2025-01-16T14:05:00'),
    },
    {
      id: '2',
      name: 'Zadaci za vježbu.pdf',
      size: '1.8 MB',
      uploadedBy: 'Ana Horvat',
      uploadedAt: new Date('2025-01-16T14:15:00'),
    },
  ]

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Mock initial chat messages
  useEffect(() => {
    setChatMessages([
      {
        id: '1',
        userId: 'tutor-1',
        userName: 'Ana Horvat',
        message: 'Bok! Spremni za današnju lekciju?',
        timestamp: new Date('2025-01-16T14:00:00'),
        type: 'text',
      },
      {
        id: '2',
        userId: 'student-1',
        userName: 'Marko Marić',
        message: 'Da, može!',
        timestamp: new Date('2025-01-16T14:00:30'),
        type: 'text',
      },
    ])
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'student-1', // Current user
      userName: 'Marko Marić',
      message: newMessage,
      timestamp: new Date(),
      type: 'text',
    }

    setChatMessages([...chatMessages, message])
    setNewMessage('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In production, upload to server
      toast.success(`${file.name} uploadano`)
    }
  }

  const handleEndSession = () => {
    if (confirm('Jeste li sigurni da želite završiti sesiju?')) {
      toast.success('Sesija završena')
      // Redirect to session summary
      window.location.href = '/dashboard'
    }
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    toast.success(isScreenSharing ? 'Screen sharing zaustavljen' : 'Screen sharing pokrenut')
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    toast.success(isRecording ? 'Recording zaustavljen' : 'Recording pokrenut')
  }

  const getProviderEmbed = () => {
    switch (sessionData.videoProvider) {
      case 'zoom':
        return (
          <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white">
            <div className="text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Zoom Meeting</h3>
              <p className="text-gray-400 mb-4">Meeting ID: {params.id}</p>
              <Button
                variant="primary"
                onClick={() => window.open(sessionData.meetingUrl, '_blank')}
              >
                Otvori u Zoom aplikaciji
              </Button>
            </div>
          </div>
        )
      case 'meet':
        return (
          <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white">
            <div className="text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">Google Meet</h3>
              <p className="text-gray-400 mb-4">Meeting Link aktivan</p>
              <Button
                variant="primary"
                onClick={() => window.open(sessionData.meetingUrl, '_blank')}
              >
                Otvori Google Meet
              </Button>
            </div>
          </div>
        )
      case 'teams':
        return (
          <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white">
            <div className="text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Microsoft Teams</h3>
              <p className="text-gray-400 mb-4">Meeting aktivan</p>
              <Button
                variant="primary"
                onClick={() => window.open(sessionData.meetingUrl, '_blank')}
              >
                Otvori Teams
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-white font-semibold">{sessionData.subject}</h1>
            <p className="text-sm text-gray-400">
              {sessionData.tutor.name} • {sessionData.student.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Timer */}
          <div className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-gray-300" />
            <span className="text-white font-mono">{formatTime(sessionTime)}</span>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-lg animate-pulse">
              <Circle className="w-3 h-3 fill-white text-white" />
              <span className="text-white text-sm font-medium">Recording</span>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Video/Whiteboard/Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Tab Navigation */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 flex-shrink-0">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-4 py-3 flex items-center space-x-2 border-b-2 transition-colors ${
                  activeTab === 'video'
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
              </button>
              <button
                onClick={() => setActiveTab('whiteboard')}
                className={`px-4 py-3 flex items-center space-x-2 border-b-2 transition-colors ${
                  activeTab === 'whiteboard'
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Paintbrush className="w-4 h-4" />
                <span>Whiteboard</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-3 flex items-center space-x-2 border-b-2 transition-colors ${
                  activeTab === 'chat'
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
                {chatMessages.length > 0 && (
                  <Badge variant="danger" className="ml-2">
                    {chatMessages.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`px-4 py-3 flex items-center space-x-2 border-b-2 transition-colors ${
                  activeTab === 'files'
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Datoteke</span>
                {sharedFiles.length > 0 && (
                  <Badge variant="info" className="ml-2">
                    {sharedFiles.length}
                  </Badge>
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-hidden">
            {activeTab === 'video' && (
              <div className="w-full h-full">{getProviderEmbed()}</div>
            )}

            {activeTab === 'whiteboard' && (
              <div className="w-full h-full">
                <InteractiveWhiteboard />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="w-full h-full flex flex-col bg-gray-800 rounded-lg">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {msg.userName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline space-x-2 mb-1">
                          <span className="font-semibold text-white text-sm">
                            {msg.userName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {msg.timestamp.toLocaleTimeString('hr-HR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="border-t border-gray-700 p-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Napiši poruku..."
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button variant="primary" onClick={handleSendMessage}>
                      Pošalji
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="w-full h-full bg-gray-800 rounded-lg p-4">
                <div className="mb-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">
                        Klikni ili povuci datoteke za upload
                      </p>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <h3 className="text-white font-semibold mb-3">Podijeljene datoteke</h3>
                  {sharedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-650 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-400" />
                        <div>
                          <p className="text-white font-medium text-sm">{file.name}</p>
                          <p className="text-gray-400 text-xs">
                            {file.uploadedBy} • {file.size}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              {/* Video Toggle */}
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-lg transition-colors ${
                  isVideoOn
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Audio Toggle */}
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-3 rounded-lg transition-colors ${
                  isAudioOn
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Screen Share */}
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-lg transition-colors ${
                  isScreenSharing
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <MonitorUp className="w-5 h-5" />
              </button>

              {/* Recording */}
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-lg transition-colors ${
                  isRecording
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <Circle className="w-5 h-5" />
              </button>

              {/* Settings */}
              <button className="p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* End Call */}
            <Button variant="danger" onClick={handleEndSession} icon={<PhoneOff className="w-5 h-5" />}>
              Završi sesiju
            </Button>

            <div className="flex items-center space-x-2">
              {/* Participants Toggle */}
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Participants */}
        {showParticipants && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Sudionici ({participants.length})
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="bg-gray-700 rounded-lg p-3 hover:bg-gray-650 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                          {participant.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        {participant.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{participant.name}</p>
                        <Badge variant={participant.role === 'tutor' ? 'info' : 'secondary'}>
                          {participant.role === 'tutor' ? 'Instruktor' : 'Student'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <div
                      className={`flex items-center space-x-1 ${
                        participant.isVideoOn ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {participant.isVideoOn ? (
                        <Camera className="w-3 h-3" />
                      ) : (
                        <CameraOff className="w-3 h-3" />
                      )}
                      <span>{participant.isVideoOn ? 'Video ON' : 'Video OFF'}</span>
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${
                        participant.isAudioOn ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {participant.isAudioOn ? (
                        <Mic className="w-3 h-3" />
                      ) : (
                        <MicOff className="w-3 h-3" />
                      )}
                      <span>{participant.isAudioOn ? 'Audio ON' : 'Audio OFF'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Session Info */}
            <div className="p-4 border-t border-gray-700 bg-gray-750">
              <h4 className="text-white font-semibold mb-3 text-sm">Informacije o sesiji</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Trajanje:</span>
                  <span className="text-white">{sessionData.duration} min</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Početak:</span>
                  <span className="text-white">
                    {sessionData.startTime.toLocaleTimeString('hr-HR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Platforma:</span>
                  <span className="text-white capitalize">{sessionData.videoProvider}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
