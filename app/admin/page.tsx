'use client'

import React, { useState } from 'react'
import { Users, BookOpen, DollarSign, TrendingUp, Shield, Flag, CheckCircle, XCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminDashboardPage() {
  const stats = {
    totalUsers: 1234,
    totalTutors: 567,
    totalStudents: 667,
    totalSessions: 8945,
    totalRevenue: 45690,
    pendingVerifications: 12,
    reportedContent: 3,
  }

  const pendingTutors = [
    {
      id: '1',
      name: 'Marija Petrović',
      email: 'marija@example.com',
      subject: 'Matematika',
      date: new Date('2025-01-15'),
      status: 'pending',
    },
    {
      id: '2',
      name: 'Josip Kovač',
      email: 'josip@example.com',
      subject: 'Fizika',
      date: new Date('2025-01-14'),
      status: 'pending',
    },
  ]

  const recentUsers = [
    {
      id: '1',
      name: 'Ana Horvat',
      email: 'ana@example.com',
      role: 'TUTOR',
      date: new Date('2025-01-16'),
    },
    {
      id: '2',
      name: 'Marko Novak',
      email: 'marko@example.com',
      role: 'STUDENT',
      date: new Date('2025-01-16'),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Upravljaj platformom</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ukupno korisnika</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.totalTutors} instruktora / {stats.totalStudents} učenika
                </p>
              </div>
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ukupno sesija</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ukupni prihod</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Na čekanju</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p>
                <p className="text-sm text-orange-600 mt-1">Verifikacije</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Verifications */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Verifikacije instruktora</h2>
                <Badge variant="warning">{pendingTutors.length} na čekanju</Badge>
              </div>

              <div className="space-y-4">
                {pendingTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                        <p className="text-sm text-gray-600">{tutor.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="info">{tutor.subject}</Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(tutor.date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="primary" size="sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Odobri
                        </Button>
                        <Button variant="danger" size="sm">
                          <XCircle className="w-4 h-4 mr-1" />
                          Odbij
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Users */}
            <Card>
              <h2 className="text-xl font-bold mb-6">Novi korisnici</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Ime
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Uloga
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Datum
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                        Akcije
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4 text-sm text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={user.role === 'TUTOR' ? 'info' : 'default'}>
                            {user.role === 'TUTOR' ? 'Instruktor' : 'Učenik'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(user.date)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm">
                            Pogledaj
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Brze akcije</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-5 h-5 mr-2" />
                  Upravljaj korisnicima
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Predmeti
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Prihodi i isplate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Flag className="w-5 h-5 mr-2" />
                  Prijave ({stats.reportedContent})
                </Button>
              </div>
            </Card>

            {/* System Status */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Status sistema</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Server</span>
                  <Badge variant="success">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <Badge variant="success">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <Badge variant="success">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zoom Integration</span>
                  <Badge variant="success">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stripe Payments</span>
                  <Badge variant="success">Online</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
