'use client'

import React, { useState } from 'react'
import { DollarSign, TrendingUp, Download, Calendar, CreditCard } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Line } from 'recharts'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function EarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth')

  // Mock data
  const stats = {
    totalEarnings: 2450,
    thisMonth: 850,
    pending: 120,
    available: 730,
  }

  const earningsHistory = [
    { month: 'Jan', earnings: 320, sessions: 12 },
    { month: 'Feb', earnings: 450, sessions: 18 },
    { month: 'Mar', earnings: 380, sessions: 15 },
    { month: 'Apr', earnings: 520, sessions: 21 },
    { month: 'Maj', earnings: 630, sessions: 24 },
    { month: 'Jun', earnings: 850, sessions: 32 },
  ]

  const transactions = [
    {
      id: '1',
      date: new Date('2025-01-15'),
      student: 'Marko Petrović',
      subject: 'Matematika',
      duration: 60,
      amount: 30,
      status: 'completed',
    },
    {
      id: '2',
      date: new Date('2025-01-14'),
      student: 'Ana Kovač',
      subject: 'Fizika',
      duration: 90,
      amount: 45,
      status: 'completed',
    },
    {
      id: '3',
      date: new Date('2025-01-13'),
      student: 'Ivan Jurić',
      subject: 'Matematika',
      duration: 60,
      amount: 30,
      status: 'pending',
    },
    {
      id: '4',
      date: new Date('2025-01-12'),
      student: 'Petra Novak',
      subject: 'Fizika',
      duration: 60,
      amount: 30,
      status: 'completed',
    },
    {
      id: '5',
      date: new Date('2025-01-11'),
      student: 'Luka Horvat',
      subject: 'Matematika',
      duration: 90,
      amount: 45,
      status: 'completed',
    },
  ]

  const payouts = [
    {
      id: '1',
      date: new Date('2025-01-10'),
      amount: 420,
      status: 'paid',
      method: 'Bankovni račun',
    },
    {
      id: '2',
      date: new Date('2024-12-25'),
      amount: 580,
      status: 'paid',
      method: 'Bankovni račun',
    },
    {
      id: '3',
      date: new Date('2024-12-10'),
      amount: 390,
      status: 'paid',
      method: 'Bankovni račun',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Zarade i isplate</h1>
          <p className="text-gray-600">Pratite svoje prihode i isplate</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ukupno zarađeno</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalEarnings)}
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
                <p className="text-sm text-gray-600 mb-1">Ovaj mjesec</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.thisMonth)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Na čekanju</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.pending)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Dostupno za 24h</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dostupno</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.available)}
                </p>
                <Button variant="primary" size="sm" className="mt-2">
                  Zatraži isplatu
                </Button>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Zarade po mjesecima</h2>
                <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                  Izvoz
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsHistory}>
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
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="#d946ef"
                    strokeWidth={2}
                    name="Sesije"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Transactions */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Nedavne transakcije</h2>
                <Button variant="ghost" size="sm">
                  Vidi sve
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Datum
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Učenik
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Predmet
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Trajanje
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        Iznos
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {transaction.student}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {transaction.subject}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {transaction.duration}min
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge
                            variant={transaction.status === 'completed' ? 'success' : 'warning'}
                          >
                            {transaction.status === 'completed' ? 'Završeno' : 'Na čekanju'}
                          </Badge>
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
            {/* Payout History */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Povijest isplata</h2>
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(payout.amount)}
                      </span>
                      <Badge variant="success">Isplaćeno</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{payout.method}</p>
                    <p className="text-xs text-gray-500">{formatDate(payout.date)}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Method */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Način isplate</h2>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">Bankovni račun</span>
                </div>
                <p className="text-sm text-gray-600">HR** **** **** **** **89</p>
              </div>
              <Button variant="outline" className="w-full">
                Promijeni način isplate
              </Button>
            </Card>

            {/* Info */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">ℹ️ Informacije</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Isplate se vrše svakih 15 dana</li>
                <li>• Provizija platforme je 15%</li>
                <li>• Novac je dostupan 24h nakon sesije</li>
                <li>• Minimalna isplata je 50€</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
