'use client'

import React, { useState } from 'react'
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  CheckCircle2,
  Award,
  Clock,
  Eye,
  Share2,
  Flag,
  Edit,
  Trash2,
  Bookmark,
  Tag,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/reviews/StarRating'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Reply {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    reputation: number
  }
  createdAt: Date
  votes: number
  userVote?: 'up' | 'down' | null
  isAccepted: boolean
  replies?: Reply[]
}

interface ThreadDetailPageProps {
  params: { threadId: string }
}

export default function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const [newReply, setNewReply] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const router = useRouter()

  // Mock data
  const thread = {
    id: params.threadId,
    title: 'Kako riješiti derivaciju složene funkcije?',
    content: `Imam problema s razumijevanjem chain rule za derivacije složenih funkcija.

Konkretno, trebam derivirati funkciju: f(x) = sin(x²)

Znam da je to složena funkcija gdje je vanjska funkcija sin(x), a unutarnja je x², ali ne znam kako pravilno primijeniti chain rule.

Može li mi netko objasniti korak po korak?`,
    category: 'matematika',
    tags: ['derivacije', 'kalkulus', 'chain-rule'],
    author: {
      id: 'user-1',
      name: 'Marko Marić',
      reputation: 450,
    },
    createdAt: new Date('2025-01-16T10:00:00'),
    views: 124,
    votes: 15,
    userVote: null,
    isSaved: false,
  }

  const replies: Reply[] = [
    {
      id: '1',
      content: `Izvrsno pitanje! Chain rule kaže da za složenu funkciju f(g(x)), derivacija je:

**f'(g(x)) · g'(x)**

U tvom slučaju:
- Vanjska funkcija: f(u) = sin(u), gdje je u = x²
- Unutarnja funkcija: g(x) = x²

**Korak po korak:**

1) Derivacija vanjske funkcije: f'(u) = cos(u)
2) Derivacija unutarnje funkcije: g'(x) = 2x
3) Primjena chain rule:

   **d/dx[sin(x²)] = cos(x²) · 2x = 2x·cos(x²)**

Dakle, konačan odgovor je: **2x·cos(x²)**

Ključ je zapamtiti da prvo deriviraš vanjsku funkciju (ostavljajući unutarnju netaknutu), pa pomnožiš s derivacijom unutarnje funkcije.`,
      author: {
        id: 'tutor-1',
        name: 'Ana Horvat',
        reputation: 2340,
      },
      createdAt: new Date('2025-01-16T10:15:00'),
      votes: 28,
      userVote: null,
      isAccepted: true,
    },
    {
      id: '2',
      content: `Dodao bih još jedan savjet - probaj vizualizirati chain rule kao "luk i strijelu":

🎯 Vanjska funkcija je meta (što vidiš izvana)
🏹 Unutarnja funkcija je put do mete

Deriviraš prvo što vidiš (vanjsku), zatim "put" do nje (unutarnju).

Još primjera za vježbu:
- d/dx[cos(3x)] = -sin(3x) · 3 = -3sin(3x)
- d/dx[(x² + 1)⁵] = 5(x² + 1)⁴ · 2x = 10x(x² + 1)⁴

Nadam se da pomaže!`,
      author: {
        id: 'user-3',
        name: 'Petra Kovačić',
        reputation: 890,
      },
      createdAt: new Date('2025-01-16T11:00:00'),
      votes: 12,
      userVote: null,
      isAccepted: false,
    },
    {
      id: '3',
      content: `Super objašnjenje! Sad mi je puno jasnije. Hvala svima! 🙏`,
      author: {
        id: 'user-1',
        name: 'Marko Marić',
        reputation: 450,
      },
      createdAt: new Date('2025-01-16T11:30:00'),
      votes: 3,
      userVote: null,
      isAccepted: false,
    },
  ]

  const handleVote = (type: 'up' | 'down', targetType: 'thread' | 'reply', id?: string) => {
    toast.success(type === 'up' ? 'Upvotano' : 'Downvotano')
  }

  const handleAcceptAnswer = (replyId: string) => {
    toast.success('Odgovor označen kao najbolji!')
  }

  const handleSubmitReply = () => {
    if (!newReply.trim()) {
      toast.error('Molimo unesite odgovor')
      return
    }

    toast.success('Odgovor objavljen!')
    setNewReply('')
    setReplyingTo(null)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 60) return `prije ${diffInMins} min`
    if (diffInHours < 24) return `prije ${diffInHours}h`
    return `prije ${diffInDays}d`
  }

  const acceptedAnswer = replies.find((r) => r.isAccepted)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/forum')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            ← Natrag na forum
          </button>
        </div>

        {/* Thread */}
        <Card className="mb-6">
          <div className="flex items-start space-x-4">
            {/* Votes */}
            <div className="flex flex-col items-center space-y-2 flex-shrink-0">
              <button
                onClick={() => handleVote('up', 'thread')}
                className={`p-2 rounded-lg transition-colors ${
                  thread.userVote === 'up'
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              <span className="text-2xl font-bold text-gray-900">{thread.votes}</span>
              <button
                onClick={() => handleVote('down', 'thread')}
                className={`p-2 rounded-lg transition-colors ${
                  thread.userVote === 'down'
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <ArrowDown className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{thread.title}</h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{thread.content}</p>
              </div>

              {/* Author & Meta */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                      {thread.author.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{thread.author.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Badge variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {thread.author.reputation}
                        </Badge>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(thread.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    {thread.views} pregleda
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bookmark className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Flag className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Answers Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {replies.length} {replies.length === 1 ? 'Odgovor' : 'Odgovora'}
          </h2>
        </div>

        {/* Accepted Answer (if exists) */}
        {acceptedAnswer && (
          <Card className="mb-4 border-2 border-green-500 bg-green-50">
            <div className="flex items-start space-x-4">
              {/* Votes */}
              <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                <button
                  onClick={() => handleVote('up', 'reply', acceptedAnswer.id)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <span className="text-xl font-bold text-gray-900">{acceptedAnswer.votes}</span>
                <button
                  onClick={() => handleVote('down', 'reply', acceptedAnswer.id)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
                <div className="pt-2">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="success" className="font-semibold">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Prihvaćen odgovor
                  </Badge>
                </div>

                <div className="prose max-w-none mb-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{acceptedAnswer.content}</p>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-2 pt-4 border-t border-green-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                    {acceptedAnswer.author.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {acceptedAnswer.author.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Badge variant="secondary" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {acceptedAnswer.author.reputation}
                      </Badge>
                      <span>{formatTimeAgo(acceptedAnswer.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Other Replies */}
        <div className="space-y-4 mb-8">
          {replies
            .filter((r) => !r.isAccepted)
            .map((reply) => (
              <Card key={reply.id}>
                <div className="flex items-start space-x-4">
                  {/* Votes */}
                  <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                    <button
                      onClick={() => handleVote('up', 'reply', reply.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-bold text-gray-900">{reply.votes}</span>
                    <button
                      onClick={() => handleVote('down', 'reply', reply.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </button>
                    {thread.author.id === 'current-user' && !acceptedAnswer && (
                      <button
                        onClick={() => handleAcceptAnswer(reply.id)}
                        className="mt-2 p-2 hover:bg-green-100 rounded-lg transition-colors group"
                        title="Označi kao najbolji odgovor"
                      >
                        <CheckCircle2 className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="prose max-w-none mb-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm">
                          {reply.author.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {reply.author.name}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <Badge variant="secondary" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              {reply.author.reputation}
                            </Badge>
                            <span>{formatTimeAgo(reply.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-primary-600 hover:text-primary-700">
                          Odgovori
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        {/* Reply Form */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tvoj odgovor</h3>
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="input-field"
            rows={6}
            placeholder="Napiši svoj odgovor..."
          />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {newReply.length}/5000 znakova
            </p>
            <Button variant="primary" onClick={handleSubmitReply}>
              Objavi odgovor
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
