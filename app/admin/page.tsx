'use client'

import { useState } from 'react'
import useSWR from 'swr'
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
  Calendar,
  Star,
  Award,
  Clock,
  Database,
  Wifi,
  HardDrive,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Loader2,
} from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | '365'>('30')

  // Fetch analytics data from API
  const { data: analyticsData, error, isLoading, mutate } = useSWR(
    `/api/admin/analytics/overview?period=${timeRange}`,
    fetcher
  )

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

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0
    return Number((((current - previous) / previous) * 100).toFixed(1))
  }

  // Mock system health data (can be moved to separate API endpoint)
  const systemHealth = {
    uptime: 99.8,
    responseTime: 245,
    dbLoad: 67,
    storage: 54,
    status: 'good' as 'good' | 'warning' | 'error',
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Učitavam analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Greška pri učitavanju</h2>
          <p className="text-gray-600 mb-4">Nije moguće dohvatiti analytics podatke</p>
          <Button onClick={() => mutate()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Pokušaj ponovno
          </Button>
        </Card>
      </div>
    )
  }

  const stats = analyticsData?.totals || {}
  const growth = analyticsData?.growth || {}
  const metrics = analyticsData?.metrics || {}
  const insights = analyticsData?.insights || {}

  // Calculate growth percentages
  const userGrowth = calculateGrowthRate(growth.newUsers || 0, (stats.users || 0) - (growth.newUsers || 0))
  const revenueGrowth = calculateGrowthRate(
    growth.revenueInPeriod || 0,
    (stats.revenue || 0) - (growth.revenueInPeriod || 0)
  )

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
                {(['7', '30', '90', '365'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      timeRange === range
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === '7' && '7 dana'}
                    {range === '30' && '30 dana'}
                    {range === '90' && '90 dana'}
                    {range === '365' && '1 godina'}
                  </button>
                ))}
              </div>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button size="sm" onClick={() => mutate()}>
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
                  {formatNumber(stats.users || 0)}
                </p>
                <div className="flex items-center mt-2">
                  {userGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {userGrowth >= 0 ? '+' : ''}{userGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs prošli period</span>
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
                  {formatCurrency(stats.revenue || 0)}
                </p>
                <div className="flex items-center mt-2">
                  {revenueGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs prošli period</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Total Bookings */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Ukupno rezervacija</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber(stats.bookings || 0)}
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    {metrics.sessionCompletionRate || 0}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">completion rate</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          {/* Content Stats */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Sadržaj</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber((stats.materials || 0) + (stats.tests || 0) + (stats.homeworkQuestions || 0))}
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm font-medium text-blue-600">
                    +{formatNumber(growth.newMaterials + growth.newTests + growth.newHomeworkQuestions || 0)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">novi</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Instruktori</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.tutors || 0)}</p>
            <p className="text-xs text-green-600 mt-1">
              {formatNumber(stats.verifiedTutors || 0)} verificirano
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Učenici</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.students || 0)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Prosječna ocjena</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.avgTutorRating || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Materijali</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.materials || 0)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Testovi</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.tests || 0)}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Growth Stats */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Rast platforme</h2>
                <p className="text-sm text-gray-600 mt-1">Zadnjih {timeRange} dana</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Novi korisnici</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(growth.newUsers || 0)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Nove rezervacije</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(growth.newBookings || 0)}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Novi materijali</p>
                <p className="text-2xl font-bold text-purple-600">{formatNumber(growth.newMaterials || 0)}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Novi testovi</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(growth.newTests || 0)}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Nova pitanja</p>
                <p className="text-2xl font-bold text-yellow-600">{formatNumber(growth.newHomeworkQuestions || 0)}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Prihod u periodu</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(growth.revenueInPeriod || 0)}</p>
              </div>
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
                <p className="text-sm text-gray-600 mt-1">Po broju sesija</p>
              </div>
              <Award className="h-5 w-5 text-yellow-500" />
            </div>

            <div className="space-y-4">
              {insights.topTutors && insights.topTutors.length > 0 ? (
                insights.topTutors.map((tutor: any, index: number) => (
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
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current mr-0.5" />
                          <span className="text-xs text-gray-600">{tutor.averageRating || 0}</span>
                        </div>
                        {tutor.verified && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatNumber(tutor.totalSessions || 0)} sesija
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Nema dostupnih podataka</p>
              )}
            </div>
          </Card>

          {/* Top Subjects */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Popularni Predmeti</h2>
                <p className="text-sm text-gray-600 mt-1">Po broju rezervacija</p>
              </div>
              <BookOpen className="h-5 w-5 text-primary-600" />
            </div>

            <div className="space-y-4">
              {insights.popularSubjects && insights.popularSubjects.length > 0 ? (
                insights.popularSubjects.map((item: any, index: number) => (
                  <div
                    key={item.subject?.id || index}
                    className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{item.subject?.name || 'N/A'}</p>
                          {item.subject?.category && (
                            <Badge variant="outline" className="text-xs">
                              {item.subject.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatNumber(item.bookingsCount || 0)} rezervacija
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Nema dostupnih podataka</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
