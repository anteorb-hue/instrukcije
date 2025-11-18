'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  MapPin,
  Edit,
  Trash2,
  Download,
  ExternalLink,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  RefreshCw,
  FileText,
  Star,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

interface Booking {
  id: string
  subject: string
  tutor: {
    id: string
    name: string
    avatar?: string
    rating: number
  }
  student: {
    id: string
    name: string
    avatar?: string
  }
  date: Date
  duration: number
  price: number
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled'
  videoProvider: 'zoom' | 'meet' | 'teams'
  meetingUrl?: string
  location?: string
  notes?: string
  sessionType: 'online' | 'in-person'
  canReschedule: boolean
  canCancel: boolean
  rating?: number
  reviewed?: boolean
}

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>(
    'all'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState<Date>(new Date())
  const [rescheduleTime, setRescheduleTime] = useState('10:00')
  const [cancelReason, setCancelReason] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Fetch bookings
  useEffect(() => {
    if (status === 'authenticated') {
      fetchBookings()
    }
  }, [status])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookings')

      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data = await response.json()

      // Transform API response to match frontend interface
      const transformedBookings: Booking[] = data.map((booking: any) => {
        // Map API status to frontend status
        let frontendStatus: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled' = 'upcoming'
        if (booking.status === 'COMPLETED') frontendStatus = 'completed'
        else if (booking.status === 'CANCELLED' || booking.status.startsWith('NO_SHOW')) frontendStatus = 'cancelled'
        else if (booking.status === 'SCHEDULED' || booking.status === 'IN_PROGRESS') frontendStatus = 'upcoming'

        // Determine if can reschedule/cancel (only upcoming bookings within reasonable time)
        const scheduledDate = new Date(booking.scheduledAt)
        const hoursUntil = (scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60)
        const canModify = frontendStatus === 'upcoming' && hoursUntil > 1

        return {
          id: booking.id,
          subject: booking.subject?.name || 'Instrukcija',
          tutor: {
            id: booking.tutor.id,
            name: booking.tutor.name,
            avatar: booking.tutor.avatar,
            rating: booking.tutor.tutorProfile?.rating || 0,
          },
          student: {
            id: booking.student.id,
            name: booking.student.name,
            avatar: booking.student.avatar,
          },
          date: new Date(booking.scheduledAt),
          duration: booking.duration,
          price: booking.price,
          status: frontendStatus,
          videoProvider: booking.videoProvider as 'zoom' | 'meet' | 'teams',
          meetingUrl: booking.meetingUrl,
          notes: booking.studentNotes || booking.tutorNotes,
          sessionType: 'online',
          canReschedule: canModify,
          canCancel: canModify,
          reviewed: !!booking.review,
          rating: booking.review?.rating,
        }
      })

      setBookings(transformedBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Greška pri dohvaćanju rezervacija')
    } finally {
      setLoading(false)
    }
  }


  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    const matchesSearch =
      booking.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tutor.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const upcomingBookings = filteredBookings.filter((b) => b.status === 'upcoming')
  const completedBookings = filteredBookings.filter((b) => b.status === 'completed')
  const cancelledBookings = filteredBookings.filter((b) => b.status === 'cancelled')

  const stats = {
    upcoming: bookings.filter((b) => b.status === 'upcoming').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    totalHours: bookings
      .filter((b) => b.status === 'completed')
      .reduce((acc, b) => acc + b.duration, 0) / 60,
  }

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date)
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayBookings = getBookingsForDate(date)
      if (dayBookings.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
          </div>
        )
      }
    }
    return null
  }

  const handleReschedule = async () => {
    if (!selectedBooking || actionLoading) return

    try {
      setActionLoading(true)

      // Combine date and time
      const [hours, minutes] = rescheduleTime.split(':')
      const newScheduledAt = new Date(rescheduleDate)
      newScheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduledAt: newScheduledAt.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reschedule booking')
      }

      toast.success('Sesija uspješno rescheduleana')
      setShowRescheduleModal(false)
      setSelectedBooking(null)

      // Refresh bookings
      await fetchBookings()
    } catch (error) {
      console.error('Error rescheduling booking:', error)
      toast.error('Greška pri rescheduleanju sesije')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!selectedBooking || !cancelReason || actionLoading) {
      toast.error('Molimo navedite razlog otkazivanja')
      return
    }

    try {
      setActionLoading(true)

      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel booking')
      }

      toast.success('Sesija uspješno otkazana. Novac će biti vraćen.')
      setShowCancelModal(false)
      setSelectedBooking(null)
      setCancelReason('')

      // Refresh bookings
      await fetchBookings()
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Greška pri otkazivanju sesije')
    } finally {
      setActionLoading(false)
    }
  }

  const exportToGoogleCalendar = (booking: Booking) => {
    const startTime = booking.date.toISOString().replace(/-|:|\.\d+/g, '')
    const endTime = new Date(booking.date.getTime() + booking.duration * 60000)
      .toISOString()
      .replace(/-|:|\.\d+/g, '')

    const details = `Instruktor: ${booking.tutor.name}%0APlatforma: ${booking.videoProvider}%0ALink: ${booking.meetingUrl || 'TBD'}`

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      booking.subject
    )}&dates=${startTime}/${endTime}&details=${details}`

    window.open(url, '_blank')
    toast.success('Kalendar otvoren')
  }

  const exportToICS = (booking: Booking) => {
    const startTime = booking.date.toISOString().replace(/-|:|\.\d+/g, '')
    const endTime = new Date(booking.date.getTime() + booking.duration * 60000)
      .toISOString()
      .replace(/-|:|\.\d+/g, '')

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${booking.subject}
DESCRIPTION:Instruktor: ${booking.tutor.name}\\nPlatforma: ${booking.videoProvider}\\nLink: ${booking.meetingUrl || 'TBD'}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${booking.subject}.ics`
    link.click()

    toast.success('ICS datoteka preuzeta')
  }

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="info">Nadolazeće</Badge>
      case 'completed':
        return <Badge variant="success">Završeno</Badge>
      case 'cancelled':
        return <Badge variant="danger">Otkazano</Badge>
      case 'rescheduled':
        return <Badge variant="warning">Prešedulirano</Badge>
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card hover className="mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{booking.subject}</h3>
              <div className="flex items-center space-x-2">
                {getStatusBadge(booking.status)}
                <Badge variant="secondary">{booking.sessionType === 'online' ? 'Online' : 'Uživo'}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              {booking.tutor.name}
              <div className="flex items-center ml-2">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="ml-1 text-xs">{booking.tutor.rating}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {booking.date.toLocaleDateString('hr-HR')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {booking.date.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })} ({booking.duration} min)
            </div>
            {booking.sessionType === 'online' && (
              <div className="flex items-center text-sm text-gray-600">
                <Video className="w-4 h-4 mr-2" />
                <span className="capitalize">{booking.videoProvider}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {booking.status === 'upcoming' && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ExternalLink className="w-4 h-4" />}
                  onClick={() => window.location.href = `/session/${booking.id}`}
                >
                  Ulaz u sesiju
                </Button>
                {booking.canReschedule && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<RefreshCw className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedBooking(booking)
                      setShowRescheduleModal(true)
                    }}
                  >
                    Reschedule
                  </Button>
                )}
                {booking.canCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedBooking(booking)
                      setShowCancelModal(true)
                    }}
                  >
                    Otkaži
                  </Button>
                )}
              </>
            )}
            {booking.status === 'completed' && !booking.reviewed && (
              <Button
                variant="outline"
                size="sm"
                icon={<Star className="w-4 h-4" />}
              >
                Ocijeni
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => exportToGoogleCalendar(booking)}
            >
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => {
                setSelectedBooking(booking)
                setShowDetailsModal(true)
              }}
            >
              Detalji
            </Button>
          </div>
        </div>

        <div className="ml-4 text-right">
          <p className="text-2xl font-bold text-primary-600">{booking.price} kn</p>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Moje rezervacije</h1>
          <p className="text-gray-600">Upravljajte svojim instrukcijama i rasporedom</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
              <p className="text-sm text-gray-600">Nadolazeće</p>
            </div>
          </Card>
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Završeno</p>
            </div>
          </Card>
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <XCircle className="w-8 h-8 text-red-600 mb-2" />
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              <p className="text-sm text-gray-600">Otkazano</p>
            </div>
          </Card>
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <CalendarIcon className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-600">{stats.totalHours.toFixed(1)}h</p>
              <p className="text-sm text-gray-600">Ukupno sati</p>
            </div>
          </Card>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'outline'}
              onClick={() => setViewMode('calendar')}
              icon={<CalendarIcon className="w-4 h-4" />}
            >
              Kalendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              onClick={() => setViewMode('list')}
              icon={<FileText className="w-4 h-4" />}
            >
              Lista
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          >
            Filteri
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Pretraži po predmetu ili instruktoru..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
              <div className="flex space-x-2">
                {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors text-sm ${
                      filterStatus === status
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {status === 'all' ? 'Sve' : status === 'upcoming' ? 'Nadolazeće' : status === 'completed' ? 'Završeno' : 'Otkazano'}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <Calendar
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="w-full border-none"
                />
              </Card>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sesije za {selectedDate.toLocaleDateString('hr-HR')}
                </h3>
                {getBookingsForDate(selectedDate).length > 0 ? (
                  getBookingsForDate(selectedDate).map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <Card className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Nema sesija za ovaj datum</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Upcoming Sessions Sidebar */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nadolazeće sesije</h3>
              <div className="space-y-3">
                {upcomingBookings.slice(0, 5).map((booking) => (
                  <Card key={booking.id} hover>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                          {booking.subject}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">{booking.tutor.name}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {booking.date.toLocaleDateString('hr-HR')}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {booking.date.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <Badge variant="info" className="ml-2">
                        {booking.duration}min
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div>
            {/* Upcoming */}
            {upcomingBookings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Nadolazeće sesije
                </h2>
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}

            {/* Completed */}
            {completedBookings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Završene sesije
                </h2>
                {completedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}

            {/* Cancelled */}
            {cancelledBookings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-600" />
                  Otkazane sesije
                </h2>
                {cancelledBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}

            {filteredBookings.length === 0 && (
              <Card className="text-center py-16">
                <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-2">Nema pronađenih rezervacija</p>
                <p className="text-sm text-gray-500 mb-6">
                  Zakaži svoju prvu instrukciju
                </p>
                <Button variant="primary" onClick={() => window.location.href = '/tutors'}>
                  Pretraži instruktore
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Reschedule Modal */}
        <Modal
          isOpen={showRescheduleModal}
          onClose={() => {
            setShowRescheduleModal(false)
            setSelectedBooking(null)
          }}
          title="Reschedule sesiju"
        >
          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Trenutni termin:</strong>{' '}
                  {selectedBooking.date.toLocaleString('hr-HR')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Novi datum
                </label>
                <Calendar
                  onChange={(value) => setRescheduleDate(value as Date)}
                  value={rescheduleDate}
                  minDate={new Date()}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Novo vrijeme
                </label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-sm text-yellow-900">
                  Instruktor mora potvrditi novi termin. Dobit ćete notifikaciju kada instruktor odgovori.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleReschedule}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Rescheduleanje...
                    </>
                  ) : (
                    'Pošalji zahtjev'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRescheduleModal(false)}
                  disabled={actionLoading}
                >
                  Odustani
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Cancel Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false)
            setSelectedBooking(null)
            setCancelReason('')
          }}
          title="Otkaži sesiju"
        >
          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-900">
                  <strong>Upozorenje:</strong> Otkazivanje sesije je trajno. Novac će biti vraćen u roku od 3-5 radnih dana.
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-700 mb-2">
                  Sesija: <strong>{selectedBooking.subject}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Termin: <strong>{selectedBooking.date.toLocaleString('hr-HR')}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razlog otkazivanja <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="Molimo navedite razlog otkazivanja..."
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={!cancelReason || actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Otkazivanje...
                    </>
                  ) : (
                    'Potvrdi otkazivanje'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCancelModal(false)}
                  disabled={actionLoading}
                >
                  Odustani
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedBooking(null)
          }}
          title="Detalji sesije"
        >
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedBooking.subject}
                </h3>
                {getStatusBadge(selectedBooking.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Instruktor</p>
                  <p className="font-medium">{selectedBooking.tutor.name}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="text-sm">{selectedBooking.tutor.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cijena</p>
                  <p className="font-medium text-primary-600">{selectedBooking.price} kn</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Datum i vrijeme</p>
                  <p className="font-medium">{selectedBooking.date.toLocaleString('hr-HR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Trajanje</p>
                  <p className="font-medium">{selectedBooking.duration} minuta</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tip</p>
                  <p className="font-medium capitalize">{selectedBooking.sessionType === 'online' ? 'Online' : 'Uživo'}</p>
                </div>
                {selectedBooking.sessionType === 'online' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Platforma</p>
                    <p className="font-medium capitalize">{selectedBooking.videoProvider}</p>
                  </div>
                )}
              </div>

              {selectedBooking.meetingUrl && selectedBooking.status === 'upcoming' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Meeting Link</p>
                  <a
                    href={selectedBooking.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline text-sm break-all"
                  >
                    {selectedBooking.meetingUrl}
                  </a>
                </div>
              )}

              {selectedBooking.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Bilješke</p>
                  <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => exportToGoogleCalendar(selectedBooking)}
                >
                  Google Calendar
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => exportToICS(selectedBooking)}
                >
                  iCal (.ics)
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}
