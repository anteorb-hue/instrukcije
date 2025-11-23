'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  BookOpen,
  Plus,
  Star,
  Award,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import AddChildModal from '@/components/parent/AddChildModal'

interface ChildData {
  linkId: string
  relationship: string | null
  isPrimary: boolean
  canBook: boolean
  canViewProgress: boolean
  child: {
    id: string
    name: string
    email: string
    avatar: string | null
    phone: string | null
    studentProfile: {
      educationLevel: string
      interests: string[]
      learningGoals: string | null
    }
  }
  stats: {
    totalLessons: number
    completedLessons: number
    scheduledLessons: number
    upcomingLessons: number
    averageRating: number
    activeSubjects: string[]
    subjectStats: Record<string, { total: number; completed: number; upcoming: number }>
  }
  nextLesson: {
    id: string
    scheduledAt: string
    duration: number
    subject: string
    tutor: string
    tutorAvatar: string | null
    meetingUrl: string | null
  } | null
}

interface UpcomingLesson {
  id: string
  scheduledAt: string
  duration: number
  subject: string
  tutor: {
    id: string
    name: string
    avatar: string | null
  }
  student: {
    id: string
    name: string
  }
  meetingUrl: string | null
  status: string
}

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  createdAt: string
  paidAt: string | null
  booking: {
    id: string
    subject: string
    tutor: string
    student: string
    scheduledAt: string
  }
}

interface DashboardData {
  children: ChildData[]
  upcomingLessons: UpcomingLesson[]
  payments: Payment[]
  overallStats: {
    totalChildren: number
    totalLessons: number
    completedLessons: number
    upcomingLessons: number
    totalSpending: number
    spendingPerChild: Record<string, number>
    averageRating: number
  }
}

export default function ParentPortalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [selectedChild, setSelectedChild] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'payments' | 'settings'>('overview')
  const [showAddChildModal, setShowAddChildModal] = useState(false)

  // Fetch dashboard data
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.user.role !== 'PARENT') {
      router.push('/dashboard')
      return
    }

    if (status === 'authenticated') {
      fetchDashboardData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/parents/dashboard')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      const data: DashboardData = await response.json()
      setDashboardData(data)

      // Set first child as selected if available
      if (data.children.length > 0 && !selectedChild) {
        setSelectedChild(data.children[0].child.id)
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Greška pri učitavanju podataka</h2>
          <Button onClick={fetchDashboardData}>Pokušaj ponovno</Button>
        </div>
      </div>
    )
  }

  const selectedChildData = dashboardData.children.find((c) => c.child.id === selectedChild)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Roditeljski portal</h1>
            <p className="text-gray-600">Pratite napredak vaše djece</p>
          </div>
          <Button onClick={() => setShowAddChildModal(true)} icon={<Plus className="w-4 h-4" />}>
            Dodaj dijete
          </Button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ukupno djece</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overallStats.totalChildren}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ukupno lekcija</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overallStats.totalLessons}</p>
                <p className="text-xs text-green-600">+{dashboardData.overallStats.upcomingLessons} nadolazećih</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ukupna potrošnja</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.overallStats.totalSpending)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prosječna ocjena</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overallStats.averageRating.toFixed(1)}</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Children Selector */}
        <div className="mb-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {dashboardData.children.map((childData) => (
              <button
                key={childData.child.id}
                onClick={() => setSelectedChild(childData.child.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all min-w-[200px] ${
                  selectedChild === childData.child.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-primary-300'
                }`}
              >
                <Avatar src={childData.child.avatar} name={childData.child.name} size="md" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{childData.child.name}</p>
                  <p className="text-sm text-gray-600">{childData.child.studentProfile.educationLevel}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            {(['overview', 'lessons', 'payments', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium transition-colors relative ${
                  activeTab === tab ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'overview' && 'Pregled'}
                {tab === 'lessons' && 'Lekcije'}
                {tab === 'payments' && 'Plaćanja'}
                {tab === 'settings' && 'Postavke'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && selectedChildData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Child Stats */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistika učenika</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Ukupno lekcija</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedChildData.stats.totalLessons}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Završeno</p>
                  <p className="text-2xl font-bold text-green-600">{selectedChildData.stats.completedLessons}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Nadolazeće</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedChildData.stats.upcomingLessons}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Prosječna ocjena</p>
                  <p className="text-2xl font-bold text-yellow-600">{selectedChildData.stats.averageRating.toFixed(1)}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Aktivni predmeti</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedChildData.stats.activeSubjects.map((subject) => (
                    <Badge key={subject} variant="primary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Next Lesson */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sljedeća lekcija</h3>
              {selectedChildData.nextLesson ? (
                <div>
                  <div className="p-4 bg-primary-50 rounded-lg mb-4">
                    <p className="font-semibold text-gray-900">{selectedChildData.nextLesson.subject}</p>
                    <p className="text-sm text-gray-600">{selectedChildData.nextLesson.tutor}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {formatDateTime(new Date(selectedChildData.nextLesson.scheduledAt))}
                    </p>
                    <p className="text-sm text-gray-600">
                      Trajanje: {selectedChildData.nextLesson.duration} min
                    </p>
                  </div>
                  {selectedChildData.nextLesson.meetingUrl && (
                    <Button
                      variant="primary"
                      onClick={() => window.open(selectedChildData.nextLesson!.meetingUrl!, '_blank')}
                      className="w-full"
                    >
                      Pristupi lekciji
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Nema nadolazećih lekcija</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'lessons' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nadolazeće lekcije</h3>
            {dashboardData.upcomingLessons.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Nema nadolazećih lekcija</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar src={lesson.tutor.avatar} name={lesson.tutor.name} size="md" />
                      <div>
                        <p className="font-semibold text-gray-900">{lesson.subject}</p>
                        <p className="text-sm text-gray-600">
                          {lesson.student.name} • {lesson.tutor.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {formatDateTime(new Date(lesson.scheduledAt))}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">{lesson.status}</Badge>
                      {lesson.meetingUrl && (
                        <Button
                          size="sm"
                          onClick={() => window.open(lesson.meetingUrl!, '_blank')}
                        >
                          Pristupi
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Povijest plaćanja</h3>
            {dashboardData.payments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Nema plaćanja</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Datum</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Učenik</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Predmet</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Instruktor</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Iznos</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDateTime(new Date(payment.createdAt))}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{payment.booking.student}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{payment.booking.subject}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{payment.booking.tutor}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={payment.status === 'COMPLETED' ? 'success' : 'warning'}>
                            {payment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Postavke</h3>
            <p className="text-gray-600">Postavke će biti dostupne uskoro...</p>
          </Card>
        )}
      </div>

      {/* Add Child Modal */}
      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  )
}
