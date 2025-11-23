'use client'

import React, { useState } from 'react'
import { CreditCard, Download, Calendar, Check, X, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PaymentsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  // Mock data
  const payments = [
    {
      id: '1',
      date: new Date('2025-01-15'),
      tutor: 'Ana Horvat',
      subject: 'Matematika',
      duration: 60,
      amount: 30,
      status: 'completed',
      invoiceUrl: '/invoices/1.pdf',
    },
    {
      id: '2',
      date: new Date('2025-01-14'),
      tutor: 'Marko Novak',
      subject: 'Engleski jezik',
      duration: 90,
      amount: 45,
      status: 'completed',
      invoiceUrl: '/invoices/2.pdf',
    },
    {
      id: '3',
      date: new Date('2025-01-13'),
      tutor: 'Petra Kovačić',
      subject: 'Programiranje',
      duration: 60,
      amount: 40,
      status: 'pending',
      invoiceUrl: null,
    },
    {
      id: '4',
      date: new Date('2025-01-12'),
      tutor: 'Ivan Babić',
      subject: 'Kemija',
      duration: 60,
      amount: 28,
      status: 'completed',
      invoiceUrl: '/invoices/4.pdf',
    },
    {
      id: '5',
      date: new Date('2025-01-10'),
      tutor: 'Lucija Marić',
      subject: 'Ekonomija',
      duration: 90,
      amount: 33,
      status: 'failed',
      invoiceUrl: null,
    },
  ]

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      brand: 'Mastercard',
      last4: '5555',
      expiry: '08/26',
      isDefault: false,
    },
  ]

  const stats = {
    totalSpent: payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    thisMonth: payments
      .filter(
        (p) =>
          p.status === 'completed' &&
          new Date(p.date).getMonth() === new Date().getMonth()
      )
      .reduce((sum, p) => sum + p.amount, 0),
    totalSessions: payments.filter((p) => p.status === 'completed').length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <X className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'failed':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Plaćeno'
      case 'pending':
        return 'Na čekanju'
      case 'failed':
        return 'Neuspjelo'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plaćanja</h1>
          <p className="text-gray-600">Pregledajte svoju povijest plaćanja</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ukupno potrošeno</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
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
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ukupno sesija</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment History */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Povijest plaćanja</h2>
                <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                  Izvoz
                </Button>
              </div>

              {/* Filter */}
              <div className="mb-6">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="input-field"
                >
                  <option value="all">Sve transakcije</option>
                  <option value="thisMonth">Ovaj mjesec</option>
                  <option value="lastMonth">Prošli mjesec</option>
                  <option value="thisYear">Ova godina</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Datum
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Instruktor
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Predmet
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                        Iznos
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                        Račun
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(payment.date)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{payment.tutor}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{payment.subject}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={getStatusColor(payment.status) as 'success' | 'warning' | 'error' | 'info'}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(payment.status)}
                              <span>{getStatusLabel(payment.status)}</span>
                            </div>
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {payment.invoiceUrl ? (
                            <a href={payment.invoiceUrl} download>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-4">Načini plaćanja</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg ${
                      method.isDefault ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-900">
                          {method.brand} •••• {method.last4}
                        </span>
                      </div>
                      {method.isDefault && (
                        <Badge variant="success" className="text-xs">
                          Zadano
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Ističe {method.expiry}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                + Dodaj novu karticu
              </Button>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">💡 Savjeti</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Sva plaćanja su sigurna putem Stripe-a</li>
                <li>• Dobivate automatsku potvrdu emailom</li>
                <li>• Računi su dostupni za preuzimanje</li>
                <li>• Povrat novca moguć unutar 24h</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
