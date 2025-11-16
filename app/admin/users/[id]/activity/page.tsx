'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import {
  ArrowLeft,
  Calendar,
  Clock,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  DollarSign,
  BookOpen,
  Mail,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
} from 'lucide-react'

interface ActivityLog {
  id: string
  type:
    | 'login'
    | 'logout'
    | 'profile_update'
    | 'lesson_booked'
    | 'lesson_completed'
    | 'payment'
    | 'review'
    | 'message'
    | 'settings_changed'
    | 'verification'
    | 'suspension'
    | 'warning'
  description: string
  details?: string
  timestamp: Date
  ipAddress?: string
  device?: string
  location?: string
  severity?: 'info' | 'warning' | 'error' | 'success'
}

export default function UserActivityPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [timeFilter, setTimeFilter] = useState<'all' | '24h' | '7d' | '30d'>('7d')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Mock user data
  const user = {
    id: userId,
    name: 'Ana Horvat',
    email: 'ana.horvat@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    role: 'TUTOR',
  }

  // Mock activity logs
  const allActivities: ActivityLog[] = [
    {
      id: '1',
      type: 'login',
      description: 'Prijava na platformu',
      timestamp: new Date('2025-01-12T10:30:00'),
      ipAddress: '192.168.1.100',
      device: 'Chrome 120 on Windows',
      location: 'Zagreb, Croatia',
      severity: 'info',
    },
    {
      id: '2',
      type: 'lesson_completed',
      description: 'Završena lekcija: Matematika - Derivacije',
      details: 'Učenik: Marko Novak, Trajanje: 60min, Ocjena: 5.0',
      timestamp: new Date('2025-01-12T14:00:00'),
      severity: 'success',
    },
    {
      id: '3',
      type: 'payment',
      description: 'Primljena uplata',
      details: 'Iznos: 40 EUR, Metoda: Stripe',
      timestamp: new Date('2025-01-12T14:05:00'),
      severity: 'success',
    },
    {
      id: '4',
      type: 'review',
      description: 'Nova recenzija primljena',
      details: '5 zvjezdica od Marko Novak: "Odlična lekcija, sve jasno objašnjeno!"',
      timestamp: new Date('2025-01-12T15:20:00'),
      severity: 'success',
    },
    {
      id: '5',
      type: 'message',
      description: 'Poslana poruka',
      details: 'Primatelj: Petra Kovač',
      timestamp: new Date('2025-01-12T16:45:00'),
      severity: 'info',
    },
    {
      id: '6',
      type: 'profile_update',
      description: 'Ažuriran profil',
      details: 'Promjene: Dostupnost, Bio tekst',
      timestamp: new Date('2025-01-12T17:10:00'),
      severity: 'info',
    },
    {
      id: '7',
      type: 'lesson_booked',
      description: 'Nova rezervacija lekcije',
      details: 'Učenik: Ivan Babić, Datum: 15.01.2025 15:00',
      timestamp: new Date('2025-01-12T18:30:00'),
      severity: 'info',
    },
    {
      id: '8',
      type: 'settings_changed',
      description: 'Promijenjene postavke obavijesti',
      details: 'Email obavijesti: Uključeno',
      timestamp: new Date('2025-01-12T19:00:00'),
      severity: 'info',
    },
    {
      id: '9',
      type: 'logout',
      description: 'Odjava s platforme',
      timestamp: new Date('2025-01-12T20:15:00'),
      severity: 'info',
    },
    {
      id: '10',
      type: 'login',
      description: 'Prijava na platformu',
      timestamp: new Date('2025-01-11T09:00:00'),
      ipAddress: '192.168.1.100',
      device: 'Chrome 120 on Windows',
      location: 'Zagreb, Croatia',
      severity: 'info',
    },
  ]

  // Filter activities
  const filteredActivities = allActivities.filter(activity => {
    // Time filter
    const now = new Date()
    const activityDate = activity.timestamp

    if (timeFilter === '24h') {
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      if (activityDate < dayAgo) return false
    } else if (timeFilter === '7d') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      if (activityDate < weekAgo) return false
    } else if (timeFilter === '30d') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      if (activityDate < monthAgo) return false
    }

    // Type filter
    if (typeFilter !== 'all' && activity.type !== typeFilter) return false

    return true
  })

  const getActivityIcon = (type: ActivityLog['type']) => {
    const icons = {
      login: LogIn,
      logout: LogOut,
      profile_update: Edit,
      lesson_booked: Calendar,
      lesson_completed: CheckCircle,
      payment: DollarSign,
      review: BookOpen,
      message: Mail,
      settings_changed: Settings,
      verification: Shield,
      suspension: Ban,
      warning: AlertTriangle,
    }
    return icons[type] || Clock
  }

  const getSeverityColor = (severity?: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    }
    return colors[(severity as keyof typeof colors) || 'info']
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('hr-HR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const exportLogs = () => {
    // Implement export functionality
    console.log('Exporting activity logs...', filteredActivities)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin/users')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Natrag
                </Button>

                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {user.avatar && <img src={user.avatar} alt={user.name} />}
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-sm text-gray-600">Activity Log</p>
                  </div>
                </div>
              </div>

              <Button size="sm" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Sve vrijeme</option>
                <option value="24h">Zadnjih 24h</option>
                <option value="7d">Zadnjih 7 dana</option>
                <option value="30d">Zadnjih 30 dana</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Sve aktivnosti</option>
                <option value="login">Prijave</option>
                <option value="logout">Odjave</option>
                <option value="lesson_booked">Rezervacije</option>
                <option value="lesson_completed">Završene lekcije</option>
                <option value="payment">Uplate</option>
                <option value="review">Recenzije</option>
                <option value="message">Poruke</option>
                <option value="settings_changed">Postavke</option>
              </select>

              <div className="flex-1"></div>

              <span className="text-sm text-gray-600 self-center">
                {filteredActivities.length} aktivnosti
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Activity Timeline */}
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type)
            const isFirst = index === 0
            const isLast = index === filteredActivities.length - 1

            return (
              <div key={activity.id} className="relative">
                {/* Timeline Line */}
                {!isLast && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-200"></div>
                )}

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                        activity.severity === 'success'
                          ? 'bg-green-100'
                          : activity.severity === 'warning'
                          ? 'bg-yellow-100'
                          : activity.severity === 'error'
                          ? 'bg-red-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          activity.severity === 'success'
                            ? 'text-green-600'
                            : activity.severity === 'warning'
                            ? 'text-yellow-600'
                            : activity.severity === 'error'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {activity.description}
                          </h3>
                          {activity.details && (
                            <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                          )}
                        </div>
                        {activity.severity && (
                          <Badge className={getSeverityColor(activity.severity)}>
                            {activity.severity}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimestamp(activity.timestamp)}</span>
                        </div>

                        {activity.ipAddress && (
                          <div className="flex items-center gap-1">
                            <span>IP: {activity.ipAddress}</span>
                          </div>
                        )}

                        {activity.device && (
                          <div className="flex items-center gap-1">
                            <span>{activity.device}</span>
                          </div>
                        )}

                        {activity.location && (
                          <div className="flex items-center gap-1">
                            <span>{activity.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}

          {filteredActivities.length === 0 && (
            <Card className="p-12 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nema aktivnosti
              </h3>
              <p className="text-gray-600">
                Nema aktivnosti za odabrani period i filter.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
