'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  Loader2,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/utils'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: string | null
}

export default function NotificationsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Fetch notifications
  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications()
    }
  }, [status])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications')

      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data: Notification[] = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const markAsRead = async (notificationIds: string[]) => {
    try {
      setActionLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark as read')
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (notificationIds.includes(n.id) ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Error marking as read:', error)
      alert('Greška pri označavanju notifikacija')
    } finally {
      setActionLoading(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      setActionLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markAll: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark all as read')
      }

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
      alert('Greška pri označavanju notifikacija')
    } finally {
      setActionLoading(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete notification')
      }

      // Update local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      setSelectedNotifications((prev) => prev.filter((id) => id !== notificationId))
    } catch (error) {
      console.error('Error deleting notification:', error)
      alert('Greška pri brisanju notifikacije')
    } finally {
      setActionLoading(false)
    }
  }

  const deleteSelected = async () => {
    if (selectedNotifications.length === 0) return

    for (const id of selectedNotifications) {
      await deleteNotification(id)
    }
    setSelectedNotifications([])
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

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead([notification.id])
    }

    // Navigate based on type
    try {
      const data = notification.data ? JSON.parse(notification.data) : null

      switch (notification.type) {
        case 'new_message':
          if (data?.messageId) {
            router.push('/messages')
          }
          break
        case 'booking_received':
        case 'booking_confirmed':
        case 'booking_rescheduled':
        case 'booking_cancelled':
          router.push('/bookings')
          break
        case 'payment_received':
        case 'payment_completed':
          router.push('/bookings')
          break
        case 'review_received':
          router.push('/reviews')
          break
        default:
          break
      }
    } catch (error) {
      console.error('Error parsing notification data:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Obavijesti</h1>
            {unreadCount > 0 && (
              <p className="text-gray-600">
                Imate {unreadCount} {unreadCount === 1 ? 'nepročitanu obavijest' : 'nepročitanih obavijesti'}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={actionLoading}
                icon={<CheckCheck className="w-4 h-4" />}
              >
                Označi sve pročitano
              </Button>
            )}
            <Button
              variant="outline"
              onClick={fetchNotifications}
              disabled={loading}
              icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
            >
              Osvježi
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filteri
              </h3>

              <div className="space-y-2 mb-6">
                <button
                  onClick={() => setFilter('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filter === 'all' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  Sve ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filter === 'unread' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  Nepročitane ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filter === 'read' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  Pročitane ({notifications.length - unreadCount})
                </button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Tip obavijesti</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setTypeFilter('all')}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      typeFilter === 'all' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    Sve
                  </button>
                  {notificationTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        typeFilter === type ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      {getTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications List */}
          <div className="lg:col-span-3">
            {selectedNotifications.length > 0 && (
              <Card className="mb-4 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedNotifications.length} odabrano
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(selectedNotifications)}
                      disabled={actionLoading}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Označi pročitano
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={deleteSelected}
                      disabled={actionLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Obriši
                    </Button>
                    <Button size="sm" variant="ghost" onClick={deselectAll}>
                      Poništi
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {filteredNotifications.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {filter === 'all' ? 'Nemate obavijesti' : `Nemate ${filter === 'unread' ? 'nepročitanih' : 'pročitanih'} obavijesti`}
                  </h3>
                  <p className="text-gray-600">
                    Obavijesti će se pojaviti ovdje
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer hover:shadow-md transition-all ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="p-4 flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          toggleSelectNotification(notification.id)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />

                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(new Date(notification.createdAt))}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead([notification.id])
                            }}
                            disabled={actionLoading}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          disabled={actionLoading}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {filteredNotifications.length > 0 && (
              <div className="mt-4 text-center">
                <Button variant="ghost" onClick={selectAll}>
                  Odaberi sve
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
