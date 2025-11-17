'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Star,
  MapPin,
  Video,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  MessageSquare,
  Heart,
  Share2
} from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import BookingCalendar from '@/components/calendar/BookingCalendar'
import { formatCurrency, getDayOfWeekName } from '@/lib/utils'

export default function TutorProfilePage() {
  const params = useParams()
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [sessionType, setSessionType] = useState<'online' | 'in-person'>('online')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('ZOOM')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')

  // Mock data - in real app, fetch from API
  const tutor = {
    id: params.id,
    name: 'Ana Horvat',
    avatar: null,
    title: 'Magistar matematike sa 10+ godina iskustva',
    hourlyRate: 25,
    averageRating: 4.9,
    totalSessions: 234,
    totalStudents: 89,
    responseTime: 15,
    verified: true,
    availableOnline: true,
    availableInPerson: true,
    bio: 'Pozdrav! Moje ime je Ana i s velikim entuzijazmom predajem matematiku već više od 10 godina. Imam magistarski stupanj iz matematike i certificirana sam nastavnica. Specijaliziram se za pripremu maturanata i pomoć učenicima s težim matematičkim konceptima. Moj pristup je individualiziran - prilagođavam se svakom učeniku i osiguravam da razumiju gradivo, a ne samo pamte formule.',
    subjects: ['Matematika', 'Fizika', 'Statistika'],
    educationLevels: ['Osnovna škola', 'Srednja škola', 'Fakultet'],
    languages: ['Hrvatski', 'Engleski', 'Njemački'],
    education: [
      'Magistar matematike, PMF Zagreb (2013)',
      'Profesor matematike, PMF Zagreb (2011)',
    ],
    certifications: [
      'Cambridge Teaching Certificate',
      'Microsoft Certified Educator',
    ],
    experience: '10+ godina',
    availability: [
      { day: 1, dayName: 'Ponedjeljak', slots: ['09:00-12:00', '14:00-18:00'] },
      { day: 2, dayName: 'Utorak', slots: ['09:00-12:00', '14:00-18:00'] },
      { day: 3, dayName: 'Srijeda', slots: ['14:00-18:00'] },
      { day: 4, dayName: 'Četvrtak', slots: ['09:00-12:00', '14:00-18:00'] },
      { day: 5, dayName: 'Petak', slots: ['09:00-15:00'] },
    ],
    reviews: [
      {
        id: '1',
        student: 'Marko P.',
        rating: 5,
        comment: 'Izvrsna profesorica! Konačno razumijem diferencijalnu matematiku. Toplo preporučujem!',
        date: '2025-01-10',
      },
      {
        id: '2',
        student: 'Lucija K.',
        rating: 5,
        comment: 'Ana je strpljiva i detaljno objašnjava. Moja ocjena iz matematike se popravila sa 2 na 4!',
        date: '2025-01-08',
      },
      {
        id: '3',
        student: 'Ivan M.',
        rating: 4,
        comment: 'Odlična priprema za maturu. Sve preporuke!',
        date: '2025-01-05',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header Card */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side - Avatar & Quick Info */}
            <div className="flex-shrink-0">
              <div className="relative">
                <Avatar src={tutor.avatar} name={tutor.name} size="xl" />
                {tutor.verified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {tutor.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">{tutor.title}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gradient">
                    {formatCurrency(tutor.hourlyRate)}
                  </div>
                  <div className="text-sm text-gray-500">po satu</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <div>
                    <div className="font-semibold">{tutor.averageRating}</div>
                    <div className="text-xs text-gray-500">Ocjena</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="font-semibold">{tutor.totalSessions}</div>
                    <div className="text-xs text-gray-500">Sesija</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="font-semibold">{tutor.totalStudents}</div>
                    <div className="text-xs text-gray-500">Učenika</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="font-semibold">{tutor.responseTime}min</div>
                    <div className="text-xs text-gray-500">Odgovor</div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tutor.subjects.map((subject, index) => (
                  <Badge key={index} variant="info">{subject}</Badge>
                ))}
                {tutor.availableOnline && (
                  <Badge variant="success">Online</Badge>
                )}
                {tutor.availableInPerson && (
                  <Badge variant="success">Uživo</Badge>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setBookingModalOpen(true)}
                  icon={<Calendar className="w-5 h-5" />}
                  className="flex-1"
                >
                  Zakaži termin
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<MessageSquare className="w-5 h-5" />}
                >
                  Pošalji poruku
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">O meni</h2>
              <p className="text-gray-700 whitespace-pre-line">{tutor.bio}</p>
            </Card>

            {/* Education & Certifications */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Obrazovanje i certifikati
              </h2>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Obrazovanje</h3>
                <ul className="space-y-2">
                  {tutor.education.map((edu, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5" />
                      <span className="text-gray-700">{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Certifikati</h3>
                <ul className="space-y-2">
                  {tutor.certifications.map((cert, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Award className="w-5 h-5 text-primary-600 mt-0.5" />
                      <span className="text-gray-700">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Reviews */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Recenzije ({tutor.reviews.length})
              </h2>
              <div className="space-y-6">
                {tutor.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900">{review.student}</div>
                      <div className="flex items-center space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Availability */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Dostupnost
              </h2>
              <div className="space-y-3">
                {tutor.availability.map((day) => (
                  <div key={day.day}>
                    <div className="font-semibold text-gray-900 mb-1">
                      {day.dayName}
                    </div>
                    <div className="space-y-1">
                      {day.slots.map((slot, index) => (
                        <div key={index} className="text-sm text-gray-600 pl-4">
                          {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Languages */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Jezici</h2>
              <div className="flex flex-wrap gap-2">
                {tutor.languages.map((lang, index) => (
                  <Badge key={index} variant="default">{lang}</Badge>
                ))}
              </div>
            </Card>

            {/* Education Levels */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Razine poučavanja
              </h2>
              <div className="flex flex-wrap gap-2">
                {tutor.educationLevels.map((level, index) => (
                  <Badge key={index} variant="default">{level}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false)
          setSelectedDate(null)
          setSelectedTime(null)
          setSessionType('online')
          setLocation('')
          setNotes('')
        }}
        title="Zakaži termin"
        size="xl"
      >
        <div className="space-y-6">
          {/* Session Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tip sesije
            </label>
            <div className="grid grid-cols-2 gap-4">
              {tutor.availableOnline && (
                <button
                  onClick={() => setSessionType('online')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${sessionType === 'online'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <Video className={`w-6 h-6 mx-auto mb-2 ${sessionType === 'online' ? 'text-primary-600' : 'text-gray-600'}`} />
                  <div className={`font-semibold ${sessionType === 'online' ? 'text-primary-700' : 'text-gray-900'}`}>
                    Online
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Video poziv
                  </div>
                </button>
              )}
              {tutor.availableInPerson && (
                <button
                  onClick={() => setSessionType('in-person')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${sessionType === 'in-person'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <MapPin className={`w-6 h-6 mx-auto mb-2 ${sessionType === 'in-person' ? 'text-primary-600' : 'text-gray-600'}`} />
                  <div className={`font-semibold ${sessionType === 'in-person' ? 'text-primary-700' : 'text-gray-900'}`}>
                    Uživo
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Fizička lokacija
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Calendar */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Odaberi datum i vrijeme
            </h3>
            <BookingCalendar
              availability={tutor.availability.map(a => ({
                dayOfWeek: a.day,
                startTime: a.slots[0]?.split('-')[0] || '09:00',
                endTime: a.slots[0]?.split('-')[1] || '18:00',
              }))}
              bookedSlots={[]}
              onSelectSlot={(date, time) => {
                setSelectedDate(date)
                setSelectedTime(time)
              }}
            />
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Predmet
            </label>
            <select
              className="input-field"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Odaberi predmet...</option>
              {tutor.subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Online: Video Platform */}
          {sessionType === 'online' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video platforma
              </label>
              <select
                className="input-field"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="ZOOM">Zoom</option>
                <option value="GOOGLE_MEET">Google Meet</option>
                <option value="MICROSOFT_TEAMS">Microsoft Teams</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Link za sastanak će biti poslan nakon potvrde rezervacije
              </p>
            </div>
          )}

          {/* In-Person: Location */}
          {sessionType === 'in-person' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokacija <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Npr. Kavana Central, Trg bana Jelačića 5, Zagreb"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-2">
                Dogovorite preciznu lokaciju sa instruktorom
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bilješke (opcionalno)
            </label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="Napišite što biste htjeli naučiti ili razjasniti..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>1 sat instrukcije</span>
                <span className="font-semibold">{formatCurrency(tutor.hourlyRate)}</span>
              </div>
              {selectedDate && selectedTime && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Termin:</span>
                  <span>{selectedDate.toLocaleDateString('hr-HR')} u {selectedTime}</span>
                </div>
              )}
              {sessionType === 'in-person' && (
                <div className="flex items-start justify-between text-sm text-amber-700 bg-amber-50 p-2 rounded">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="flex-1">Uživo instrukcije</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Ukupno</span>
                <span className="font-bold text-xl text-gradient">
                  {formatCurrency(tutor.hourlyRate)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!selectedDate || !selectedTime || !selectedSubject || (sessionType === 'in-person' && !location)}
          >
            Potvrdi rezervaciju
          </Button>

          {/* Validation Messages */}
          {(!selectedDate || !selectedTime) && (
            <p className="text-sm text-amber-600 text-center">
              Molimo odaberite datum i vrijeme iz kalendara
            </p>
          )}
        </div>
      </Modal>
    </div>
  )
}
