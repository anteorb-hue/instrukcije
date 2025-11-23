'use client'

import React, { useState } from 'react'
import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
  MessageSquare,
  Settings,
  Plus,
  Eye,
  Download,
  Star,
  Target,
  BarChart,
  Shield,
  Bell,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { useRouter } from 'next/navigation'

interface Child {
  id: string
  name: string
  age: number
  avatar?: string
  grade: string
  totalLessons: number
  completedLessons: number
  averageGrade: number
  activeSubjects: string[]
  nextLesson?: {
    subject: string
    tutor: string
    date: Date
  }
  weeklyProgress: number
}

interface RecentLesson {
  id: string
  childId: string
  subject: string
  tutor: {
    id: string
    name: string
    avatar?: string
  }
  date: Date
  duration: number
  grade: number
  attendance: 'present' | 'absent' | 'late'
  homework?: {
    assigned: boolean
    completed: boolean
    grade?: number
  }
  notes?: string
}

interface Payment {
  id: string
  childId: string
  amount: number
  date: Date
  status: 'paid' | 'pending' | 'overdue'
  description: string
  method: string
}

export default function ParentPortalPage() {
  // const router = useRouter()
  const [selectedChild, setSelectedChild] = useState<string>('child-1')
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'payments' | 'settings'>('overview')

  // Mock data
  const children: Child[] = [
    {
      id: 'child-1',
      name: 'Marko Horvat',
      age: 15,
      grade: '9. razred',
      totalLessons: 48,
      completedLessons: 45,
      averageGrade: 4.5,
      activeSubjects: ['Matematika', 'Engleski jezik', 'Fizika'],
      nextLesson: {
        subject: 'Matematika',
        tutor: 'Ana Horvat',
        date: new Date('2025-01-18T16:00:00'),
      },
      weeklyProgress: 92,
    },
    {
      id: 'child-2',
      name: 'Ana Horvat',
      age: 12,
      grade: '6. razred',
      totalLessons: 32,
      completedLessons: 30,
      averageGrade: 4.8,
      activeSubjects: ['Hrvatski jezik', 'Matematika'],
      nextLesson: {
        subject: 'Hrvatski jezik',
        tutor: 'Petra Kovačić',
        date: new Date('2025-01-19T15:00:00'),
      },
      weeklyProgress: 95,
    },
  ]

  const recentLessons: RecentLesson[] = [
    {
      id: 'l1',
      childId: 'child-1',
      subject: 'Matematika',
      tutor: {
        id: 't1',
        name: 'Ana Horvat',
      },
      date: new Date('2025-01-15T16:00:00'),
      duration: 60,
      grade: 5,
      attendance: 'present',
      homework: {
        assigned: true,
        completed: true,
        grade: 4,
      },
      notes: 'Odličan napredak u derivacijama. Nastavi tako!',
    },
    {
      id: 'l2',
      childId: 'child-1',
      subject: 'Engleski jezik',
      tutor: {
        id: 't2',
        name: 'Petra Kovačić',
      },
      date: new Date('2025-01-14T17:00:00'),
      duration: 45,
      grade: 4,
      attendance: 'present',
      homework: {
        assigned: true,
        completed: false,
      },
      notes: 'Vježbati više vocabulary. Domaća zadaća nije predana.',
    },
    {
      id: 'l3',
      childId: 'child-1',
      subject: 'Fizika',
      tutor: {
        id: 't3',
        name: 'Ivan Petrović',
      },
      date: new Date('2025-01-13T15:00:00'),
      duration: 60,
      grade: 5,
      attendance: 'present',
      homework: {
        assigned: true,
        completed: true,
        grade: 5,
      },
      notes: 'Izvrsno! Savladao dinamiku.',
    },
  ]

  const payments: Payment[] = [
    {
      id: 'p1',
      childId: 'child-1',
      amount: 600,
      date: new Date('2025-01-15'),
      status: 'paid',
      description: '4 lekcije matematike (Siječanj)',
      method: 'Kartica',
    },
    {
      id: 'p2',
      childId: 'child-1',
      amount: 450,
      date: new Date('2025-01-10'),
      status: 'paid',
      description: '3 lekcije engleskog (Siječanj)',
      method: 'Kartica',
    },
    {
      id: 'p3',
      childId: 'child-2',
      amount: 400,
      date: new Date('2025-01-20'),
      status: 'pending',
      description: '4 lekcije hrvatskog (Siječanj)',
      method: 'Kartica',
    },
  ]

  const currentChild = children.find((c) => c.id === selectedChild)!
  const childLessons = recentLessons.filter((l) => l.childId === selectedChild)
  const childPayments = payments.filter((p) => p.childId === selectedChild)

  const stats = {
    totalChildren: children.length,
    totalLessons: children.reduce((sum, c) => sum + c.completedLessons, 0),
    avgGrade: (children.reduce((sum, c) => sum + c.averageGrade, 0) / children.length).toFixed(1),
    monthlySpent: payments
      .filter((p) => p.status === 'paid' && new Date(p.date).getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + p.amount, 0),
  }

  const getAttendanceBadge = (attendance: string) => {
    switch (attendance) {
      case 'present':
        return <Badge variant="success">Prisutan/a</Badge>
      case 'absent':
        return <Badge variant="danger">Odsutan/a</Badge>
      case 'late':
        return <Badge variant="warning">Kasno</Badge>
      default:
        return null
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Plaćeno</Badge>
      case 'pending':
        return <Badge variant="warning">Na čekanju</Badge>
      case 'overdue':
        return <Badge variant="danger">Dospjelo</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Roditeljski portal</h1>
          <p className="text-gray-600">
            Pratite napredak svoje djece i upravljajte njihovim obrazovanjem
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalChildren}</p>
            <p className="text-sm text-gray-600">Djece</p>
          </Card>
          <Card className="text-center">
            <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.totalLessons}</p>
            <p className="text-sm text-gray-600">Lekcija ovaj mjesec</p>
          </Card>
          <Card className="text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{stats.avgGrade}</p>
            <p className="text-sm text-gray-600">Prosječna ocjena</p>
          </Card>
          <Card className="text-center">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.monthlySpent} kn</p>
            <p className="text-sm text-gray-600">Ovaj mjesec</p>
          </Card>
        </div>

        {/* Child Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all flex-shrink-0 ${
                  selectedChild === child.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Avatar src={child.avatar} name={child.name} size="sm" />
                <div className="text-left">
                  <p className="font-medium">{child.name}</p>
                  <p className={`text-xs ${selectedChild === child.id ? 'text-white/80' : 'text-gray-500'}`}>
                    {child.grade}
                  </p>
                </div>
              </button>
            ))}
            <button className="flex items-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all flex-shrink-0">
              <Plus className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Dodaj dijete</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Pregled
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`pb-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'lessons'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Lekcije
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`pb-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'payments'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Plaćanja
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Postavke
              </button>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Card */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  Napredak ovaj tjedan
                </h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Ukupno</span>
                    <span className="font-medium">{currentChild.weeklyProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                      style={{ width: `${currentChild.weeklyProgress}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{currentChild.completedLessons}</p>
                    <p className="text-sm text-gray-600">Lekcija</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{currentChild.averageGrade}</p>
                    <p className="text-sm text-gray-600">Prosječna ocjena</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{currentChild.activeSubjects.length}</p>
                    <p className="text-sm text-gray-600">Predmeta</p>
                  </div>
                </div>
              </Card>

              {/* Active Subjects */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Aktivni predmeti</h3>
                <div className="space-y-3">
                  {currentChild.activeSubjects.map((subject) => (
                    <div
                      key={subject}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                        <span className="font-medium text-gray-900">{subject}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Vidi detalje
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Lessons */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Nedavne lekcije</h3>
                <div className="space-y-4">
                  {childLessons.slice(0, 3).map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{lesson.subject}</h4>
                          <p className="text-sm text-gray-600">
                            {lesson.date.toLocaleDateString('hr-HR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-semibold text-gray-900">{lesson.grade}</span>
                          </div>
                          {getAttendanceBadge(lesson.attendance)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar src={lesson.tutor.avatar} name={lesson.tutor.name} size="xs" />
                        <span className="text-sm text-gray-600">{lesson.tutor.name}</span>
                      </div>
                      {lesson.notes && (
                        <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded mt-2">
                          💬 {lesson.notes}
                        </p>
                      )}
                      {lesson.homework && (
                        <div className="mt-2 flex items-center space-x-2">
                          {lesson.homework.completed ? (
                            <Badge variant="success">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Domaća zadaća predana
                            </Badge>
                          ) : (
                            <Badge variant="warning">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Domaća zadaća nije predana
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Next Lesson */}
              {currentChild.nextLesson && (
                <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                    Sljedeća lekcija
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{currentChild.nextLesson.subject}</p>
                    <p className="text-sm text-gray-600">{currentChild.nextLesson.tutor}</p>
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {currentChild.nextLesson.date.toLocaleDateString('hr-HR', {
                          day: 'numeric',
                          month: 'long',
                        })}{' '}
                        u{' '}
                        {currentChild.nextLesson.date.toLocaleTimeString('hr-HR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <Button variant="primary" className="w-full mt-4" size="sm">
                    Prikaži detalje
                  </Button>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Brze akcije</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" icon={<Calendar className="w-5 h-5" />}>
                    Zakaži lekciju
                  </Button>
                  <Button variant="outline" className="w-full justify-start" icon={<MessageSquare className="w-5 h-5" />}>
                    Kontaktiraj instruktora
                  </Button>
                  <Button variant="outline" className="w-full justify-start" icon={<Download className="w-5 h-5" />}>
                    Preuzmi izvještaj
                  </Button>
                </div>
              </Card>

              {/* Safety Notice */}
              <Card className="bg-green-50 border-green-200">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Sigurno okruženje</h4>
                    <p className="text-sm text-green-800">
                      Sve lekcije su snimljene i mogu se pregledati. Instruktori su verificirani.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Povijest lekcija</h3>
            <div className="space-y-4">
              {childLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{lesson.subject}</h4>
                        {getAttendanceBadge(lesson.attendance)}
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar src={lesson.tutor.avatar} name={lesson.tutor.name} size="xs" />
                        <span className="text-sm text-gray-600">{lesson.tutor.name}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {lesson.date.toLocaleDateString('hr-HR')}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {lesson.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="text-2xl font-bold text-gray-900">{lesson.grade}</span>
                      </div>
                    </div>
                  </div>
                  {lesson.notes && (
                    <div className="mb-3 p-3 bg-blue-50 rounded">
                      <p className="text-sm font-medium text-gray-900 mb-1">Bilješke instruktora:</p>
                      <p className="text-sm text-gray-700">{lesson.notes}</p>
                    </div>
                  )}
                  {lesson.homework && (
                    <div className="flex items-center justify-between">
                      <div>
                        {lesson.homework.completed ? (
                          <Badge variant="success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Domaća predana
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Domaća nije predana
                          </Badge>
                        )}
                      </div>
                      {lesson.homework.grade && (
                        <span className="text-sm text-gray-600">
                          Ocjena: <strong>{lesson.homework.grade}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Povijest plaćanja</h3>
                <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
                  Izvoz
                </Button>
              </div>
              <div className="space-y-3">
                {childPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{payment.description}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>
                          {payment.date.toLocaleDateString('hr-HR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span>{payment.method}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 mb-1">{payment.amount} kn</p>
                      {getPaymentStatusBadge(payment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Sigurnost i privatnost
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Snimanje lekcija</p>
                    <p className="text-sm text-gray-600">Automatski snimi sve lekcije</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Samo verificirani instruktori</p>
                    <p className="text-sm text-gray-600">Prikaži samo verificirane profile</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Chat monitoring</p>
                    <p className="text-sm text-gray-600">Primaj izvještaj chat komunikacije</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-600" />
                Obavijesti
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Email obavijesti</p>
                    <p className="text-sm text-gray-600">Primaj izvještaje emailom</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Neobavljene domaće zadaće</p>
                    <p className="text-sm text-gray-600">Obavijesti o propuštenim zadaćama</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">Tjedno izvješće</p>
                    <p className="text-sm text-gray-600">Sažetak napretka svaki tjedan</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
