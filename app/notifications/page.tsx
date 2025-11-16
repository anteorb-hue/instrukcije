'use client'

import React, { useState } from 'react'
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Calendar,
  CreditCard,
  MessageSquare,
  Star,
  UserPlus,
  Video,
  RefreshCw,
  AlertCircle,
  Filter,
  Trash2,
  Settings as SettingsIcon,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: Date
  data?: any
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const router = useRouter()

  // Mock data
  const allNotifications: Notification[] = [
    {
      id: '1',
      type: 'booking_received',
      title: 'Nova rezervacija',
      message: 'Marko Marić je zakazao instrukciju iz matematike za 18.01.2025. u 14:00',
      read: false,
      createdAt: new Date('2025-01-16T10:30:00'),
    },
    {
      id: '2',
      type: 'payment_received',
      title: 'Plaćanje potvrđeno',
      message: 'Ana Horvat je platila instrukciju - 150 kn. Novac će biti prebačen na vaš račun za 2-3 radna dana.',
      read: false,
      createdAt: new Date('2025-01-16T09:15:00'),
    },
    {
      id: '3',
      type: 'new_message',
      title: 'Nova poruka',
      message: 'Petra Kovačić: "Imam pitanje u vezi domaće zadaće..."',
      read: false,
      createdAt: new Date('2025-01-16T08:45:00'),
    },
    {
      id: '4',
      type: 'review_received',
      title: 'Nova recenzija',
      message: 'Ivan Petrović vam je ostavio recenziju 5/5: "Odličan instruktor! Sve jasno objašnjava."',
      read: true,
      createdAt: new Date('2025-01-15T16:20:00'),
    },
    {
      id: '5',
      type: 'booking_rescheduled',
      title: 'Sesija prešedulirana',
      message: 'Laura Babić je prešedulirala sesiju s 17.01. na 18.01.2025. u 15:00',
      read: true,
      createdAt: new Date('2025-01-15T14:10:00'),
    },
    {
      id: '6',
      type: 'booking_cancelled',
      title: 'Sesija otkazana',
      message: 'Marija Jurić je otkazala sesiju za 20.01.2025. Novac će biti vraćen.',
      read: true,
      createdAt: new Date('2025-01-15T11:00:00'),
    },
    {
      id: '7',
      type: 'session_starting',
      title: 'Sesija uskoro počinje',
      message: 'Vaša sesija s Tomislavom Horvat počinje za 15 minuta',
      read: true,
      createdAt: new Date('2025-01-14T13:45:00'),
    },
    {
      id: '8',
      type: 'reminder',
      title: 'Podsjetnik',
      message: 'Imate 3 sesije sutra. Pripremite materijale.',
      read: true,
      createdAt: new Date('2025-01-13T18:00:00'),
    },
  ]

  const [notifications, setNotifications] = useState(allNotifications)

  const filteredNotifications = notifications.filter((n) => {
    const matchesReadStatus =
      filter === 'all' || (filter === 'unread' && !n.read) || (filter === 'read' && n.read)
    const matchesType = typeFilter === 'all' || n.type === typeFilter
    return matchesReadStatus && matchesType
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const notificationTypes = Array.from(new Set(notifications.map((n) => n.type)))

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_received':
      case 'booking_confirmed':
        return <Calendar className="w-6 h-6 text-blue-600" />
      case 'booking_rescheduled':
        return <RefreshCw className="w-6 h-6 text-yellow-600" />
      case 'booking_cancelled':
        return <X className="w-6 h-6 text-red-600" />
      case 'payment_received':
      case 'payment_completed':
        return <CreditCard className="w-6 h-6 text-green-600" />
      case 'new_message':
        return <MessageSquare className="w-6 h-6 text-purple-600" />
      case 'review_received':
        return <Star className="w-6 h-6 text-yellow-500" />
      case 'session_starting':
        return <Video className="w-6 h-6 text-blue-600" />
      case 'new_user':
        return <UserPlus className="w-6 h-6 text-green-600" />
      case 'reminder':
        return <AlertCircle className="w-6 h-6 text-orange-600" />
      default:
        return <Bell className="w-6 h-6 text-gray-600" />
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      booking_received: 'Rezervacije',
      booking_confirmed: 'Rezervacije',
      booking_rescheduled: 'Rezervacije',
      booking_cancelled: 'Rezervacije',
      payment_received: 'Plaćanja',
      payment_completed: 'Plaćanja',
      new_message: 'Poruke',
      review_received: 'Recenzije',
      session_starting: 'Sesije',
      reminder: 'Podsjetnici',
      new_user: 'Korisnici',
    }
    return labels[type] || type
  }

  const markAsRead = (notificationIds: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (notificationIds.includes(n.id) ? { ...n, read: true } : n))
    )
  }

  const markAsUnread = (notificationIds: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (notificationIds.includes(n.id) ? { ...n, read: false } : n))
    )
  }

  const deleteNotifications = (notificationIds: string[]) => {
    setNotifications((prev) => prev.filter((n) => !notificationIds.includes(n.id)))
    setSelectedNotifications([])
  }

  const markAllAsRead = () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)
    markAsRead(unreadIds)
  }

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedNotifications(filteredNotifications.map((n) => n.id))
  }

  const deselectAll = () => {
    setSelectedNotifications([])
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 1) return 'Upravo'
    if (diffInMins < 60) return `Prije ${diffInMins} min`
    if (diffInHours < 24) return `Prije ${diffInHours}h`
    if (diffInDays < 7) return `Prije ${diffInDays}d`
    return date.toLocaleDateString('hr-HR')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">Notifikacije</h1>
              {unreadCount > 0 && (
                <Badge variant="danger" className="text-base">
                  {unreadCount} novo
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              icon={<SettingsIcon className="w-4 h-4" />}
              onClick={() => router.push('/settings')}
            >
              Postavke
            </Button>
          </div>
          <p className="text-gray-600">Pregledajte sve svoje notifikacije</p>
        </div>

        {/* Filters & Actions */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            {/* Filter Tabs */}
            <div className="flex space-x-2">
              {(['all', 'unread', 'read'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'Sve' : f === 'unread' ? 'Nepročitane' : 'Pročitane'}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Sve vrste</option>
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {getTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedNotifications.length} odabrano
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Check className="w-4 h-4" />}
                  onClick={() => markAsRead(selectedNotifications)}
                >
                  Označi pročitanim
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Bell className="w-4 h-4" />}
                  onClick={() => markAsUnread(selectedNotifications)}
                >
                  Označi nepročitanim
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => deleteNotifications(selectedNotifications)}
                >
                  Obriši
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        {filteredNotifications.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={selectAll}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Odaberi sve
              </button>
              {selectedNotifications.length > 0 && (
                <button
                  onClick={deselectAll}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Poništi odabir
                </button>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Označi sve pročitanim
              </button>
            )}
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="text-center py-16">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">Nema notifikacija</p>
              <p className="text-sm text-gray-500">
                {filter === 'unread'
                  ? 'Sve notifikacije su pročitane'
                  : 'Ovdje će se prikazati vaše notifikacije'}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all ${
                  !notification.read ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : ''
                } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-primary-500' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleSelectNotification(notification.id)}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />

                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          className={`text-base font-semibold mb-1 ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p
                      className={`text-sm mb-3 ${
                        notification.read ? 'text-gray-600' : 'text-gray-700'
                      }`}
                    >
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-2">
                      {!notification.read ? (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Check className="w-3 h-3" />}
                          onClick={() => markAsRead([notification.id])}
                        >
                          Označi pročitanim
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Bell className="w-3 h-3" />}
                          onClick={() => markAsUnread([notification.id])}
                        >
                          Označi nepročitanim
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 className="w-3 h-3" />}
                        onClick={() => deleteNotifications([notification.id])}
                      >
                        Obriši
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
