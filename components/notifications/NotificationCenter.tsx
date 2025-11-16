'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  FileText,
  Settings,
  ExternalLink,
} from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
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

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Mock data - in production, fetch from API
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'booking_received',
      title: 'Nova rezervacija',
      message: 'Marko Marić je zakazao instrukciju',
      read: false,
      createdAt: new Date('2025-01-16T10:30:00'),
      data: { bookingId: '123' },
    },
    {
      id: '2',
      type: 'payment_received',
      title: 'Plaćanje potvrđeno',
      message: 'Ana Horvat je platila instrukciju - 150 kn',
      read: false,
      createdAt: new Date('2025-01-16T09:15:00'),
      data: { paymentId: '456' },
    },
    {
      id: '3',
      type: 'new_message',
      title: 'Nova poruka',
      message: 'Petra Kovačić vam je poslala poruku',
      read: false,
      createdAt: new Date('2025-01-16T08:45:00'),
      data: { userId: '789' },
    },
    {
      id: '4',
      type: 'review_received',
      title: 'Nova recenzija',
      message: 'Dobili ste ocjenu 5/5 od Ivan Petrović',
      read: true,
      createdAt: new Date('2025-01-15T16:20:00'),
      data: { reviewId: '321' },
    },
    {
      id: '5',
      type: 'booking_rescheduled',
      title: 'Sesija prešedulirana',
      message: 'Sesija je prešedulirana na 18.01.2025. 15:00',
      read: true,
      createdAt: new Date('2025-01-15T14:10:00'),
      data: { bookingId: '654' },
    },
    {
      id: '6',
      type: 'booking_cancelled',
      title: 'Sesija otkazana',
      message: 'Student je otkazao sesiju za 20.01.2025.',
      read: true,
      createdAt: new Date('2025-01-15T11:00:00'),
      data: { bookingId: '987' },
    },
  ]

  useEffect(() => {
    // Load notifications
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_received':
      case 'booking_confirmed':
        return <Calendar className="w-5 h-5 text-blue-600" />
      case 'booking_rescheduled':
        return <RefreshCw className="w-5 h-5 text-yellow-600" />
      case 'booking_cancelled':
        return <X className="w-5 h-5 text-red-600" />
      case 'payment_received':
      case 'payment_completed':
        return <CreditCard className="w-5 h-5 text-green-600" />
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-purple-600" />
      case 'review_received':
        return <Star className="w-5 h-5 text-yellow-500" />
      case 'session_starting':
        return <Video className="w-5 h-5 text-blue-600" />
      case 'new_user':
        return <UserPlus className="w-5 h-5 text-green-600" />
      case 'reminder':
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead([notification.id])

    // Navigate based on type
    switch (notification.type) {
      case 'booking_received':
      case 'booking_confirmed':
      case 'booking_rescheduled':
      case 'booking_cancelled':
        router.push('/bookings')
        break
      case 'payment_received':
      case 'payment_completed':
        router.push('/dashboard/earnings')
        break
      case 'new_message':
        router.push('/messages')
        break
      case 'review_received':
        router.push('/dashboard')
        break
      default:
        router.push('/notifications')
    }

    setIsOpen(false)
  }

  const markAsRead = (notificationIds: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (notificationIds.includes(n.id) ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - notificationIds.length))

    // In production, call API
    // await fetch('/api/notifications', {
    //   method: 'PATCH',
    //   body: JSON.stringify({ notificationIds }),
    // })
  }

  const markAllAsRead = () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)
    markAsRead(unreadIds)

    // In production, call API with markAll flag
    // await fetch('/api/notifications', {
    //   method: 'PATCH',
    //   body: JSON.stringify({ markAll: true }),
    // })
  }

  const deleteNotification = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))

    // In production, call API
    // await fetch(`/api/notifications?id=${notificationId}`, {
    //   method: 'DELETE',
    // })
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

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">Notifikacije</h3>
              {unreadCount > 0 && (
                <Badge variant="danger">{unreadCount}</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Označi sve
                </button>
              )}
              <button
                onClick={() => {
                  router.push('/notifications')
                  setIsOpen(false)
                }}
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Nema notifikacija</p>
              </div>
            ) : (
              <>
                {/* Unread */}
                {unreadNotifications.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Nepročitane
                      </p>
                    </div>
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer bg-blue-50/50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                {notification.title}
                              </p>
                              <button
                                onClick={(e) => deleteNotification(notification.id, e)}
                                className="text-gray-400 hover:text-gray-600 ml-2"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Read */}
                {readNotifications.length > 0 && (
                  <div>
                    {unreadNotifications.length > 0 && (
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                          Pročitane
                        </p>
                      </div>
                    )}
                    {readNotifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1 opacity-60">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                {notification.title}
                              </p>
                              <button
                                onClick={(e) => deleteNotification(notification.id, e)}
                                className="text-gray-400 hover:text-gray-600 ml-2"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  router.push('/notifications')
                  setIsOpen(false)
                }}
                className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2 hover:bg-primary-50 rounded transition-colors"
              >
                Vidi sve notifikacije
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
