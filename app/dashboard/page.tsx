'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Star,
  BookOpen,
  Award,
  MessageSquare,
  Bell,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import Link from 'next/link'
import { Line, Bar } from 'recharts'
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  // Redirect parents to their own portal
  if (session.user.role === 'PARENT') {
    router.push('/parent-portal')
    return null
  }

  const isTutor = session.user.role === 'TUTOR'

  // Mock data - u pravoj aplikaciji dohvatiti iz API-ja
  const tutorStats = {
    totalEarnings: 2450,
    thisMonthEarnings: 850,
    totalSessions: 234,
    thisMonthSessions: 18,
    totalStudents: 89,
    activeStudents: 24,
    averageRating: 4.9,
    responseTime: 15,
  }

  const studentStats = {
    totalSessions: 42,
    thisMonthSessions: 6,
    totalSpent: 1260,
    thisMonthSpent: 180,
    activeTutors: 5,
    averageRating: 4.8,
  }

  const earningsData = [
    { month: 'Jan', earnings: 320 },
    { month: 'Feb', earnings: 450 },
    { month: 'Mar', earnings: 380 },
    { month: 'Apr', earnings: 520 },
    { month: 'Maj', earnings: 630 },
    { month: 'Jun', earnings: 850 },
  ]

  const sessionsData = [
    { day: 'Pon', sessions: 4 },
    { day: 'Uto', sessions: 6 },
    { day: 'Sri', sessions: 3 },
    { day: 'Čet', sessions: 5 },
    { day: 'Pet', sessions: 7 },
    { day: 'Sub', sessions: 2 },
    { day: 'Ned', sessions: 1 },
  ]

  const upcomingSessions = [
    {
      id: '1',
      student: 'Marko Petrović',
      subject: 'Matematika',
      time: new Date('2025-01-17T15:00:00'),
      duration: 60,
      status: 'SCHEDULED',
      meetingUrl: 'https://zoom.us/j/123456789',
    },
    {
      id: '2',
      student: 'Ana Kovač',
      subject: 'Fizika',
      time: new Date('2025-01-17T17:00:00'),
      duration: 60,
      status: 'SCHEDULED',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
    },
    {
      id: '3',
      student: 'Ivan Jurić',
      subject: 'Matematika',
      time: new Date('2025-01-18T10:00:00'),
      duration: 90,
      status: 'SCHEDULED',
      meetingUrl: 'https://teams.microsoft.com/l/meetup-join/...',
    },
  ]

  const recentActivities = [
    {
      id: '1',
      type: 'booking',
      message: 'Nova rezervacija od Marko Petrović',
      time: new Date('2025-01-16T14:30:00'),
    },
    {
      id: '2',
      type: 'review',
      message: 'Nova recenzija: 5 zvjezdica od Ana Kovač',
      time: new Date('2025-01-16T12:15:00'),
    },
    {
      id: '3',
      type: 'message',
      message: 'Nova poruka od Ivan Jurić',
      time: new Date('2025-01-16T10:45:00'),
    },
    {
      id: '4',
      type: 'payment',
      message: 'Primljeno plaćanje: €30',
      time: new Date('2025-01-15T18:20:00'),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            {isTutor
              ? `Dobrodošli natrag, ${session.user.name}! Evo pregleda vaših aktivnosti.`
              : `Pozdrav ${session.user.name}! Pratite svoj napredak ovdje.`}
          </p>
        </div>

        {/* Stats Cards */}
        {isTutor ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ukupna zarada</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(tutorStats.totalEarnings)}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    +{formatCurrency(tutorStats.thisMonthEarnings)} ovaj mjesec
                  </p>
                </div>
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sesije</p>
                  <p className="text-2xl font-bold text-gray-900">{tutorStats.totalSessions}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    +{tutorStats.thisMonthSessions} ovaj mjesec
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Učenici</p>
                  <p className="text-2xl font-bold text-gray-900">{tutorStats.totalStudents}</p>
                  <p className="text-sm text-purple-600 mt-1">
                    {tutorStats.activeStudents} aktivnih
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Prosječna ocjena</p>
                  <p className="text-2xl font-bold text-gray-900">{tutorStats.averageRating}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(tutorStats.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ukupne sesije</p>
                  <p className="text-2xl font-bold text-gray-900">{studentStats.totalSessions}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    +{studentStats.thisMonthSessions} ovaj mjesec
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ukupno potrošeno</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(studentStats.totalSpent)}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {formatCurrency(studentStats.thisMonthSpent)} ovaj mjesec
                  </p>
                </div>
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aktivni instruktori</p>
                  <p className="text-2xl font-bold text-gray-900">{studentStats.activeTutors}</p>
                  <p className="text-sm text-purple-600 mt-1">Različiti predmeti</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Prosječna ocjena</p>
                  <p className="text-2xl font-bold text-gray-900">{studentStats.averageRating}</p>
                  <p className="text-sm text-gray-500 mt-1">Dano instruktorima</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Charts */}
            {isTutor && (
              <Card>
                <h2 className="text-xl font-bold mb-4">Zarada po mjesecima</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      name="Zarada (€)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            <Card>
              <h2 className="text-xl font-bold mb-4">Sesije ovaj tjedan</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sessionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sessions" fill="#0ea5e9" name="Sesije" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Nadolazeće sesije</h2>
                <Link href="/bookings">
                  <Button variant="ghost" size="sm">
                    Vidi sve
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{session.student}</h3>
                          <Badge variant="info">{session.subject}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {formatDateTime(session.time)}
                        </p>
                        <p className="text-sm text-gray-500">{session.duration} minuta</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(session.status)}>
                          {getStatusLabel(session.status)}
                        </Badge>
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="primary" size="sm">
                            Pridruži se
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Brze radnje</h2>
              <div className="space-y-3">
                {isTutor ? (
                  <>
                    <Link href="/dashboard/availability">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-5 h-5 mr-2" />
                        Uredi dostupnost
                      </Button>
                    </Link>
                    <Link href="/dashboard/earnings">
                      <Button variant="outline" className="w-full justify-start">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Zarade i isplate
                      </Button>
                    </Link>
                    <Link href="/profile/edit">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-5 h-5 mr-2" />
                        Uredi profil
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/tutors">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-5 h-5 mr-2" />
                        Pronađi instruktora
                      </Button>
                    </Link>
                    <Link href="/bookings">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-5 h-5 mr-2" />
                        Moje rezervacije
                      </Button>
                    </Link>
                    <Link href="/payments">
                      <Button variant="outline" className="w-full justify-start">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Plaćanja
                      </Button>
                    </Link>
                  </>
                )}
                <Link href="/messages">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Poruke
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Nedavne aktivnosti</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                      {activity.type === 'booking' && <Calendar className="w-4 h-4 text-white" />}
                      {activity.type === 'review' && <Star className="w-4 h-4 text-white" />}
                      {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-white" />}
                      {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(activity.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
