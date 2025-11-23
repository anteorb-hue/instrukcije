'use client'

import React, { useState } from 'react'
import {
  MessageSquare,
  TrendingUp,
  Clock,
  Search,
  Plus,
  Filter,
  Tag,
  Award,
  CheckCircle2,
  Eye,
  MessageCircleMore,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ForumThread {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  author: {
    id: string
    name: string
    avatar?: string
    reputation: number
  }
  createdAt: Date
  views: number
  replies: number
  votes: number
  hasAcceptedAnswer: boolean
  isPinned: boolean
  userVote?: 'up' | 'down' | null
}

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent')
  const [showNewThreadModal, setShowNewThreadModal] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
  })
  const router = useRouter()

  const categories = [
    { id: 'matematika', name: 'Matematika', icon: '📐', count: 234 },
    { id: 'fizika', name: 'Fizika', icon: '⚛️', count: 156 },
    { id: 'kemija', name: 'Kemija', icon: '🧪', count: 98 },
    { id: 'biologija', name: 'Biologija', icon: '🧬', count: 87 },
    { id: 'engleski', name: 'Engleski jezik', icon: '🇬🇧', count: 189 },
    { id: 'hrvatski', name: 'Hrvatski jezik', icon: '🇭🇷', count: 124 },
    { id: 'njemacki', name: 'Njemački jezik', icon: '🇩🇪', count: 76 },
    { id: 'programiranje', name: 'Programiranje', icon: '💻', count: 312 },
    { id: 'web-dev', name: 'Web Development', icon: '🌐', count: 145 },
    { id: 'data-science', name: 'Data Science', icon: '📊', count: 93 },
    { id: 'povijest', name: 'Povijest', icon: '🏛️', count: 65 },
    { id: 'geografija', name: 'Geografija', icon: '🌍', count: 58 },
    { id: 'ekonomija', name: 'Ekonomija', icon: '💼', count: 102 },
    { id: 'psihologija', name: 'Psihologija', icon: '🧠', count: 89 },
    { id: 'ostalo', name: 'Ostalo', icon: '📚', count: 145 },
  ]

  const popularTags = [
    'derivacije',
    'integrali',
    'gramatika',
    'react',
    'python',
    'mehanika',
    'organska-kemija',
    'algebra',
  ]

  const allThreads: ForumThread[] = [
    {
      id: '1',
      title: 'Kako riješiti derivaciju složene funkcije?',
      content: 'Imam problema s razumijevanjem chain rule za derivacije...',
      category: 'matematika',
      tags: ['derivacije', 'kalkulus'],
      author: {
        id: 'user-1',
        name: 'Marko Marić',
        reputation: 450,
      },
      createdAt: new Date('2025-01-16T10:00:00'),
      views: 124,
      replies: 8,
      votes: 15,
      hasAcceptedAnswer: true,
      isPinned: false,
      userVote: null,
    },
    {
      id: '2',
      title: 'Best resources for learning React hooks?',
      content: 'Looking for comprehensive tutorials on useEffect and custom hooks...',
      category: 'programiranje',
      tags: ['react', 'javascript', 'hooks'],
      author: {
        id: 'user-2',
        name: 'Ana Horvat',
        reputation: 890,
      },
      createdAt: new Date('2025-01-16T09:30:00'),
      views: 256,
      replies: 12,
      votes: 28,
      hasAcceptedAnswer: false,
      isPinned: true,
      userVote: null,
    },
    {
      id: '3',
      title: 'Razlika između Present Perfect i Past Simple?',
      content: 'Nikako ne mogu shvatiti kad koristiti koji oblik...',
      category: 'engleski',
      tags: ['gramatika', 'tenses'],
      author: {
        id: 'user-3',
        name: 'Petra Kovačić',
        reputation: 230,
      },
      createdAt: new Date('2025-01-15T16:00:00'),
      views: 89,
      replies: 5,
      votes: 12,
      hasAcceptedAnswer: true,
      isPinned: false,
      userVote: null,
    },
    {
      id: '4',
      title: 'Pomoć s Newtonovim zakonima gibanja',
      content: 'Ne razumijem kako primjeniti F=ma u zadacima...',
      category: 'fizika',
      tags: ['mehanika', 'newtonovi-zakoni'],
      author: {
        id: 'user-4',
        name: 'Ivan Petrović',
        reputation: 180,
      },
      createdAt: new Date('2025-01-15T14:20:00'),
      views: 67,
      replies: 3,
      votes: 8,
      hasAcceptedAnswer: false,
      isPinned: false,
      userVote: null,
    },
    {
      id: '5',
      title: 'Organska kemija - imenovanje spojeva',
      content: 'Trebam pomoć s IUPAC nomenkaturom za organske spojeve...',
      category: 'kemija',
      tags: ['organska-kemija', 'nomenklatura'],
      author: {
        id: 'user-5',
        name: 'Laura Babić',
        reputation: 340,
      },
      createdAt: new Date('2025-01-15T11:00:00'),
      views: 45,
      replies: 0,
      votes: 3,
      hasAcceptedAnswer: false,
      isPinned: false,
      userVote: null,
    },
  ]

  // Filter threads
  let filteredThreads = allThreads.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || thread.category === selectedCategory
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => thread.tags.includes(tag))
    return matchesSearch && matchesCategory && matchesTags
  })

  // Sort threads
  filteredThreads = [...filteredThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1

    switch (sortBy) {
      case 'popular':
        return b.votes - a.votes
      case 'unanswered':
        return a.replies - b.replies
      case 'recent':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime()
    }
  })

  const stats = {
    totalThreads: allThreads.length,
    totalReplies: allThreads.reduce((sum, t) => sum + t.replies, 0),
    activeUsers: 342,
    solvedThreads: allThreads.filter((t) => t.hasAcceptedAnswer).length,
  }

  const handleCreateThread = () => {
    if (!newThread.title || !newThread.content || !newThread.category) {
      toast.error('Molimo ispunite sva polja')
      return
    }

    // In production, call API
    toast.success('Thread kreiran!')
    setShowNewThreadModal(false)
    setNewThread({ title: '', content: '', category: '', tags: [] })
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 60) return `prije ${diffInMins}min`
    if (diffInHours < 24) return `prije ${diffInHours}h`
    return `prije ${diffInDays}d`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forum Zajednice</h1>
          <p className="text-gray-600">Postavljaj pitanja, dijeli znanje i pomozi drugima</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalThreads}</p>
            <p className="text-sm text-gray-600">Diskusija</p>
          </Card>
          <Card className="text-center">
            <MessageCircleMore className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.totalReplies}</p>
            <p className="text-sm text-gray-600">Odgovora</p>
          </Card>
          <Card className="text-center">
            <CheckCircle2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.solvedThreads}</p>
            <p className="text-sm text-gray-600">Riješeno</p>
          </Card>
          <Card className="text-center">
            <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.activeUsers}</p>
            <p className="text-sm text-gray-600">Aktivnih korisnika</p>
          </Card>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Pretraži diskusije..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              icon={<Filter className="w-5 h-5" />}
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden"
            >
              Filtriraj
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setShowNewThreadModal(true)}
            >
              Nova diskusija
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Categories */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategorije</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Sve kategorije</span>
                  </div>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{cat.icon}</span>
                        <span className="font-medium text-sm">{cat.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {cat.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Popular Tags */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Popularni tagovi
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex space-x-2">
                {(['recent', 'popular', 'unanswered'] as const).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      sortBy === sort
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {sort === 'recent' && <Clock className="w-4 h-4" />}
                    {sort === 'popular' && <TrendingUp className="w-4 h-4" />}
                    {sort === 'unanswered' && <MessageSquare className="w-4 h-4" />}
                    {sort === 'recent'
                      ? 'Najnovije'
                      : sort === 'popular'
                      ? 'Popularno'
                      : 'Neodgovoreno'}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">{filteredThreads.length} diskusija</p>
            </div>

            {/* Threads List */}
            <div className="space-y-4">
              {filteredThreads.length > 0 ? (
                filteredThreads.map((thread) => (
                  <Card
                    key={thread.id}
                    hover
                    className={`cursor-pointer ${thread.isPinned ? 'border-l-4 border-l-primary-600' : ''}`}
                    onClick={() => router.push(`/forum/${thread.id}`)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Votes */}
                      <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <ArrowUp className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="font-bold text-gray-900">{thread.votes}</span>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <ArrowDown className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors">
                              {thread.title}
                              {thread.isPinned && (
                                <Badge variant="warning" className="ml-2">
                                  Prikvačeno
                                </Badge>
                              )}
                              {thread.hasAcceptedAnswer && (
                                <CheckCircle2 className="inline w-5 h-5 ml-2 text-green-600" />
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {thread.content}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {thread.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-semibold">
                                {thread.author.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <span>{thread.author.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                {thread.author.reputation}
                              </Badge>
                            </div>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTimeAgo(thread.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {thread.views}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {thread.replies}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="text-center py-16">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 mb-2">Nema diskusija</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Budite prvi koji će postaviti pitanje
                  </p>
                  <Button variant="primary" onClick={() => setShowNewThreadModal(true)}>
                    Nova diskusija
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* New Thread Modal */}
        <Modal
          isOpen={showNewThreadModal}
          onClose={() => setShowNewThreadModal(false)}
          title="Nova diskusija"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naslov <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newThread.title}
                onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                className="input-field"
                placeholder="Ukratko opiši svoje pitanje..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorija <span className="text-red-500">*</span>
              </label>
              <select
                value={newThread.category}
                onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                className="input-field"
              >
                <option value="">Odaberi kategoriju</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newThread.content}
                onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                className="input-field"
                rows={6}
                placeholder="Detaljno opiši svoj problem ili pitanje..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagovi (opciono)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const tags = newThread.tags.includes(tag)
                        ? newThread.tags.filter((t) => t !== tag)
                        : [...newThread.tags, tag]
                      setNewThread({ ...newThread, tags })
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      newThread.tags.includes(tag)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>Savjet:</strong> Što detaljnije opišete problem, veća je šansa da
                dobijete kvalitetan odgovor.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button variant="primary" className="flex-1" onClick={handleCreateThread}>
                Objavi
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowNewThreadModal(false)}
              >
                Odustani
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
