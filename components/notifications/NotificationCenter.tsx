'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import {
  Bell,
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
  Settings,
} from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: string | null
}

export default function NotificationCenter() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch notifications when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications()
    }
  }, [status])

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

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications?limit=10')

      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data: Notification[] = await response.json()
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead([notification.id])
    }

    // Navigate based on type
    try {
      const data = notification.data ? JSON.parse(notification.data) : null

      switch (notification.type) {
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
        case 'new_message':
          if (data?.messageId) {
            router.push('/messages')
          }
          break
        case 'review_received':
          router.push('/reviews')
          break
        default:
          router.push('/notifications')
      }
    } catch (error) {
      console.error('Error parsing notification data:', error)
      router.push('/notifications')
    }

    setIsOpen(false)
  }

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (notificationIds.includes(n.id) ? { ...n, read: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - notificationIds.length))
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAll: true }),
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const notification = notifications.find((n) => n.id === notificationId)
        if (notification && !notification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
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

  // Don't render if not authenticated
  if (status !== 'authenticated') {
    return null
  }

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
              {unreadCount > 0 && <Badge variant="danger">{unreadCount}</Badge>}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  title="Označi sve pročitano"
                >
                  <CheckCheck className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={fetchNotifications}
                disabled={loading}
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
                title="Osvježi"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => {
                  router.push('/notifications')
                  setIsOpen(false)
                }}
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
                title="Postavke"
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
                      <p className="text-xs font-semibold text-gray-600 uppercase">Nepročitane</p>
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
                            <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
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
                        <p className="text-xs font-semibold text-gray-600 uppercase">Pročitane</p>
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
                            <p className="text-sm text-gray-500 mb-1">{notification.message}</p>
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
