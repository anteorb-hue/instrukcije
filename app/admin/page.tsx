'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  RefreshCw,
  Star,
  Award,
  Clock,
  Database,
  Wifi,
  HardDrive,
  AlertCircle,
  CheckCircle,
  ChevronRight,
} from 'lucide-react'

// Mock data interfaces
interface PlatformStats {
  totalUsers: number
  userGrowth: number
  totalTutors: number
  totalStudents: number
  totalRevenue: number
  revenueGrowth: number
  totalLessons: number
  completedLessons: number
  completionRate: number
  averageRating: number
  activeNow: number
}

interface RevenueData {
  month: string
  revenue: number
  lessons: number
  growth: number
}

interface TopTutor {
  id: string
  name: string
  avatar?: string
  subject: string
  totalEarnings: number
  totalLessons: number
  rating: number
  students: number
  growth: number
}

interface TopSubject {
  id: string
  name: string
  category: string
  totalLessons: number
  totalRevenue: number
  averagePrice: number
  growth: number
  tutors: number
}

interface SystemHealth {
  uptime: number
  responseTime: number
  dbLoad: number
  storage: number
  status: 'good' | 'warning' | 'error'
}

interface RecentActivity {
  id: string
  type: 'lesson' | 'registration' | 'payment' | 'review' | 'issue'
  description: string
  user?: {
    name: string
    avatar?: string
  }
  timestamp: Date
  severity?: 'info' | 'warning' | 'error'
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  // Mock platform stats
  const stats: PlatformStats = {
    totalUsers: 12547,
    userGrowth: 12.5,
    totalTutors: 856,
    totalStudents: 11691,
    totalRevenue: 1245780,
    revenueGrowth: 15.8,
    totalLessons: 45892,
    completedLessons: 43190,
    completionRate: 94.2,
    averageRating: 4.7,
    activeNow: 342,
  }

  // Mock revenue data (last 6 months)
  const revenueData: RevenueData[] = [
    { month: 'Svibanj', revenue: 185000, lessons: 7200, growth: 12.5 },
    { month: 'Lipanj', revenue: 195000, lessons: 7450, growth: 5.4 },
    { month: 'Srpanj', revenue: 210000, lessons: 7800, growth: 7.7 },
    { month: 'Kolovoz', revenue: 205000, lessons: 7650, growth: -2.4 },
    { month: 'Rujan', revenue: 225000, lessons: 8100, growth: 9.8 },
    { month: 'Listopad', revenue: 225780, lessons: 8192, growth: 0.3 },
  ]

  // Mock top tutors
  const topTutors: TopTutor[] = [
    {
      id: '1',
      name: 'Ana Horvat',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      subject: 'Matematika',
      totalEarnings: 45600,
      totalLessons: 456,
      rating: 4.9,
      students: 78,
      growth: 18.5,
    },
    {
      id: '2',
      name: 'Marko Novak',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marko',
      subject: 'Fizika',
      totalEarnings: 42300,
      totalLessons: 423,
      rating: 4.8,
      students: 65,
      growth: 15.2,
    },
    {
      id: '3',
      name: 'Petra Kovač',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petra',
      subject: 'Engleski jezik',
      totalEarnings: 39800,
      totalLessons: 398,
      rating: 4.9,
      students: 92,
      growth: 22.1,
    },
    {
      id: '4',
      name: 'Ivan Babić',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
      subject: 'Kemija',
      totalEarnings: 38500,
      totalLessons: 385,
      rating: 4.7,
      students: 58,
      growth: 12.8,
    },
    {
      id: '5',
      name: 'Lucija Marić',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucija',
      subject: 'Programiranje',
      totalEarnings: 37200,
      totalLessons: 372,
      rating: 4.8,
      students: 71,
      growth: 25.3,
    },
  ]

  // Mock top subjects
  const topSubjects: TopSubject[] = [
    {
      id: '1',
      name: 'Matematika',
      category: 'STEM',
      totalLessons: 12450,
      totalRevenue: 456780,
      averagePrice: 36.7,
      growth: 15.2,
      tutors: 156,
    },
    {
      id: '2',
      name: 'Engleski jezik',
      category: 'Jezici',
      totalLessons: 9870,
      totalRevenue: 345600,
      averagePrice: 35.0,
      growth: 18.5,
      tutors: 98,
    },
    {
      id: '3',
      name: 'Programiranje',
      category: 'STEM',
      totalLessons: 7320,
      totalRevenue: 312400,
      averagePrice: 42.7,
      growth: 28.3,
      tutors: 67,
    },
    {
      id: '4',
      name: 'Fizika',
      category: 'STEM',
      totalLessons: 6540,
      totalRevenue: 245800,
      averagePrice: 37.6,
      growth: 12.1,
      tutors: 89,
    },
    {
      id: '5',
      name: 'Kemija',
      category: 'STEM',
      totalLessons: 5890,
      totalRevenue: 218900,
      averagePrice: 37.2,
      growth: 10.5,
      tutors: 72,
    },
  ]

  // Mock system health
  const systemHealth: SystemHealth = {
    uptime: 99.8,
    responseTime: 245,
    dbLoad: 67,
    storage: 54,
    status: 'good',
  }

  // Mock recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'payment',
      description: 'Nova uplata - 150 EUR',
      user: {
        name: 'Marija Jurić',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marija',
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      severity: 'info',
    },
    {
      id: '2',
      type: 'registration',
      description: 'Novi instruktor se registrirao',
      user: {
        name: 'Tomislav Petrović',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tomislav',
      },
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      severity: 'info',
    },
    {
      id: '3',
      type: 'review',
      description: 'Nova recenzija - 5 zvjezdica',
      user: {
        name: 'Ivana Šimić',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivana',
      },
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      severity: 'info',
    },
    {
      id: '4',
      type: 'issue',
      description: 'Sporiji response time na serveru',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      severity: 'warning',
    },
    {
      id: '5',
      type: 'lesson',
      description: 'Grupna lekcija završena - 15 učenika',
      user: {
        name: 'Ana Horvat',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      },
      timestamp: new Date(Date.now() - 65 * 60 * 1000),
      severity: 'info',
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('hr-HR').format(num)
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    if (seconds < 60) return 'prije par sekundi'
    if (seconds < 3600) return `prije ${Math.floor(seconds / 60)} min`
    if (seconds < 86400) return `prije ${Math.floor(seconds / 3600)}h`
    return `prije ${Math.floor(seconds / 86400)}d`
  }

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Pregled svih ključnih metrika platforme
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Time range selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      timeRange === range
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === '7d' && '7 dana'}
                    {range === '30d' && '30 dana'}
                    {range === '90d' && '90 dana'}
                    {range === '1y' && '1 godina'}
                  </button>
                ))}
              </div>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Ukupno korisnika</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber(stats.totalUsers)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    +{stats.userGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs prošli mjesec</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Total Revenue */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Ukupna zarada</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    +{stats.revenueGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs prošli mjesec</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Total Lessons */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Ukupno lekcija</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber(stats.totalLessons)}
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    {stats.completionRate}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">completion rate</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          {/* Active Now */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Aktivnih trenutno</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber(stats.activeNow)}
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-green-600 mr-1 animate-pulse" />
                  <span className="text-sm font-medium text-green-600">Live</span>
                  <span className="text-sm text-gray-500 ml-1">korisnika online</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Wifi className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Instruktori</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalTutors)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Učenici</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalStudents)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Prosječna ocjena</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Prihodi po mjesecima</h2>
                <p className="text-sm text-gray-600 mt-1">Zadnjih 6 mjeseci</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-300">
                +15.8% ukupno
              </Badge>
            </div>

            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{data.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {formatNumber(data.lessons)} lekcija
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(data.revenue)}
                      </span>
                      <div className="flex items-center w-16">
                        {data.growth >= 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-sm font-medium text-green-600">
                              {data.growth}%
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                            <span className="text-sm font-medium text-red-600">
                              {Math.abs(data.growth)}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* System Health */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
              <Badge
                variant="outline"
                className={
                  systemHealth.status === 'good'
                    ? 'text-green-600 border-green-300'
                    : systemHealth.status === 'warning'
                    ? 'text-yellow-600 border-yellow-300'
                    : 'text-red-600 border-red-300'
                }
              >
                {systemHealth.status === 'good' && 'All Systems Operational'}
                {systemHealth.status === 'warning' && 'Minor Issues'}
                {systemHealth.status === 'error' && 'Critical Issues'}
              </Badge>
            </div>

            <div className="space-y-6">
              {/* Uptime */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Uptime</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {systemHealth.uptime}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${systemHealth.uptime}%` }}
                  />
                </div>
              </div>

              {/* Response Time */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Response Time</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {systemHealth.responseTime}ms
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      systemHealth.responseTime < 300 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min((systemHealth.responseTime / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Database Load */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Database Load</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {systemHealth.dbLoad}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      systemHealth.dbLoad < 70
                        ? 'bg-green-500'
                        : systemHealth.dbLoad < 85
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${systemHealth.dbLoad}%` }}
                  />
                </div>
              </div>

              {/* Storage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Storage Used</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {systemHealth.storage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${systemHealth.storage}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Tutors */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Top Instruktori</h2>
                <p className="text-sm text-gray-600 mt-1">Najboljih 5 po zaradi</p>
              </div>
              <Award className="h-5 w-5 text-yellow-500" />
            </div>

            <div className="space-y-4">
              {topTutors.map((tutor, index) => (
                <div
                  key={tutor.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                    {index + 1}
                  </div>

                  <Avatar className="h-12 w-12">
                    {tutor.avatar && <img src={tutor.avatar} alt={tutor.name} />}
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{tutor.name}</p>
                    <p className="text-sm text-gray-600">{tutor.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-current mr-0.5" />
                        <span className="text-xs text-gray-600">{tutor.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">
                        {formatNumber(tutor.students)} učenika
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(tutor.totalEarnings)}
                    </p>
                    <p className="text-sm text-gray-600">{formatNumber(tutor.totalLessons)} lekcija</p>
                    <div className="flex items-center justify-end mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600 mr-0.5" />
                      <span className="text-xs font-medium text-green-600">
                        +{tutor.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Subjects */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Top Predmeti</h2>
                <p className="text-sm text-gray-600 mt-1">Najpopularnijih 5 predmeta</p>
              </div>
              <BookOpen className="h-5 w-5 text-primary-600" />
            </div>

            <div className="space-y-4">
              {topSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{subject.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {subject.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatNumber(subject.tutors)} instruktora
                      </p>
                    </div>
                    <div className="flex items-center">
                      {subject.growth >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          subject.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {subject.growth >= 0 ? '+' : ''}
                        {subject.growth}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600">Lekcije</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatNumber(subject.totalLessons)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Prihod</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(subject.totalRevenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Prosj. cijena</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(subject.averagePrice)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Nedavne aktivnosti</h2>
              <p className="text-sm text-gray-600 mt-1">Zadnjih sat vremena</p>
            </div>
            <Button variant="outline" size="sm">
              Vidi sve
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {activity.user ? (
                  <Avatar className="h-10 w-10 mt-0.5">
                    {activity.user.avatar && (
                      <img src={activity.user.avatar} alt={activity.user.name} />
                    )}
                  </Avatar>
                ) : (
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center mt-0.5 ${
                      activity.severity === 'error'
                        ? 'bg-red-100'
                        : activity.severity === 'warning'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {activity.type === 'issue' && (
                      <AlertCircle
                        className={`h-5 w-5 ${
                          activity.severity === 'error'
                            ? 'text-red-600'
                            : activity.severity === 'warning'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}
                      />
                    )}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  {activity.user && (
                    <p className="text-xs text-gray-600 mt-0.5">{activity.user.name}</p>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                  <Badge
                    variant="outline"
                    className={`mt-1 text-xs ${
                      activity.type === 'payment'
                        ? 'border-green-300 text-green-700'
                        : activity.type === 'registration'
                        ? 'border-blue-300 text-blue-700'
                        : activity.type === 'review'
                        ? 'border-yellow-300 text-yellow-700'
                        : activity.type === 'issue'
                        ? 'border-red-300 text-red-700'
                        : 'border-purple-300 text-purple-700'
                    }`}
                  >
                    {activity.type === 'payment' && 'Uplata'}
                    {activity.type === 'registration' && 'Registracija'}
                    {activity.type === 'review' && 'Recenzija'}
                    {activity.type === 'issue' && 'Problem'}
                    {activity.type === 'lesson' && 'Lekcija'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
