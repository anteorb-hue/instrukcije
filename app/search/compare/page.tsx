'use client'

import { } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import {
  Star,
  Users,
  BookOpen,
  DollarSign,
  MapPin,
  Award,
  Clock,
  CheckCircle,
  X,
  Video,
  Home,
} from 'lucide-react'

// Mock tutor data (same as search)
interface Tutor {
  id: string
  name: string
  avatar?: string
  title: string
  subjects: string[]
  rating: number
  totalReviews: number
  totalStudents: number
  hourlyRate: number
  location: string
  languages: string[]
  experience: number
  availability: {
    online: boolean
    inPerson: boolean
    weekdays: boolean
    weekends: boolean
  }
  education: string
  verified: boolean
  responseTime: string
  completedLessons: number
  specializations: string[]
}

export default function CompareTutorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tutorIds = searchParams.get('ids')?.split(',') || []

  // Mock tutors - in production, fetch from API based on IDs
  const allTutors: Tutor[] = [
    {
      id: '1',
      name: 'Ana Horvat',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      title: 'Magistar matematike s 10+ godina iskustva',
      subjects: ['Matematika', 'Fizika'],
      rating: 4.9,
      totalReviews: 156,
      totalStudents: 342,
      hourlyRate: 35,
      location: 'Zagreb',
      languages: ['Hrvatski', 'Engleski'],
      experience: 10,
      availability: { online: true, inPerson: true, weekdays: true, weekends: true },
      education: 'Magistar matematike, PMF Zagreb',
      verified: true,
      responseTime: '< 1h',
      completedLessons: 1248,
      specializations: ['Matura priprema', 'Fakultetska matematika'],
    },
    {
      id: '2',
      name: 'Marko Novak',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marko',
      title: 'Native English speaker s TEFL certifikatom',
      subjects: ['Engleski jezik'],
      rating: 4.8,
      totalReviews: 203,
      totalStudents: 456,
      hourlyRate: 30,
      location: 'Split',
      languages: ['Engleski', 'Hrvatski'],
      experience: 8,
      availability: { online: true, inPerson: false, weekdays: true, weekends: false },
      education: 'BA in English Literature, TEFL Certificate',
      verified: true,
      responseTime: '< 2h',
      completedLessons: 987,
      specializations: ['Business English', 'Konverzacija'],
    },
    {
      id: '3',
      name: 'Petra Kovač',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petra',
      title: 'Web developer i instruktor programiranja',
      subjects: ['Programiranje', 'Web Development'],
      rating: 4.9,
      totalReviews: 142,
      totalStudents: 267,
      hourlyRate: 45,
      location: 'Zagreb',
      languages: ['Hrvatski', 'Engleski'],
      experience: 7,
      availability: { online: true, inPerson: true, weekdays: false, weekends: true },
      education: 'Dipl. ing. računarstva, FER Zagreb',
      verified: true,
      responseTime: '< 30min',
      completedLessons: 756,
      specializations: ['React', 'Node.js', 'Full-stack'],
    },
  ]

  const selectedTutors = allTutors.filter(t => tutorIds.includes(t.id))

  const removeTutor = (id: string) => {
    const remaining = tutorIds.filter(tid => tid !== id)
    if (remaining.length === 0) {
      router.push('/search')
    } else {
      router.push(`/search/compare?ids=${remaining.join(',')}`)
    }
  }

  if (selectedTutors.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nema instruktora za usporedbu</h2>
          <p className="text-gray-600 mb-6">
            Odaberi najmanje 2 instruktora s liste pretrage za usporedbu
          </p>
          <Button onClick={() => router.push('/search')}>Natrag na pretragu</Button>
        </Card>
      </div>
    )
  }

  const comparisonMetrics = [
    { key: 'rating', label: 'Ocjena', icon: Star, format: (v: number) => `${v} ⭐` },
    { key: 'hourlyRate', label: 'Cijena/sat', icon: DollarSign, format: (v: number) => `${v} EUR` },
    { key: 'experience', label: 'Iskustvo', icon: Award, format: (v: number) => `${v} godina` },
    { key: 'totalReviews', label: 'Recenzije', icon: Users, format: (v: number) => v },
    { key: 'totalStudents', label: 'Učenika', icon: Users, format: (v: number) => v },
    { key: 'completedLessons', label: 'Lekcije', icon: BookOpen, format: (v: number) => v },
    { key: 'responseTime', label: 'Odgovor', icon: Clock, format: (v: string) => v },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Usporedba instruktora</h1>
              <p className="mt-1 text-sm text-gray-600">
                Usporeди {selectedTutors.length} {selectedTutors.length === 2 ? 'instruktora' : 'instruktora'}
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push('/search')}>
              Natrag na pretragu
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tutor Headers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {selectedTutors.map(tutor => (
            <Card key={tutor.id} className="p-6 relative">
              <button
                onClick={() => removeTutor(tutor.id)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="h-24 w-24 mb-4">
                  {tutor.avatar && <img src={tutor.avatar} alt={tutor.name} />}
                </Avatar>

                {tutor.verified && (
                  <div className="flex items-center gap-1 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Verificiran</span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{tutor.title}</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {tutor.subjects.map(subject => (
                  <Badge key={subject} className="bg-primary-100 text-primary-700">
                    {subject}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Metrika
                  </th>
                  {selectedTutors.map(tutor => (
                    <th key={tutor.id} className="text-center py-4 px-6 text-sm font-semibold text-gray-900">
                      {tutor.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonMetrics.map(metric => {
                  const Icon = metric.icon
                  return (
                    <tr key={metric.key} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{metric.label}</span>
                        </div>
                      </td>
                      {selectedTutors.map(tutor => {
                        const value = tutor[metric.key as keyof Tutor]
                        return (
                          <td key={tutor.id} className="py-4 px-6 text-center text-gray-900">
                            {metric.format(value as any)}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}

                {/* Availability */}
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Online</span>
                    </div>
                  </td>
                  {selectedTutors.map(tutor => (
                    <td key={tutor.id} className="py-4 px-6 text-center">
                      {tutor.availability.online ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Uživo</span>
                    </div>
                  </td>
                  {selectedTutors.map(tutor => (
                    <td key={tutor.id} className="py-4 px-6 text-center">
                      {tutor.availability.inPerson ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Location */}
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Lokacija</span>
                    </div>
                  </td>
                  {selectedTutors.map(tutor => (
                    <td key={tutor.id} className="py-4 px-6 text-center text-gray-900">
                      {tutor.location}
                    </td>
                  ))}
                </tr>

                {/* Languages */}
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">Jezici</span>
                  </td>
                  {selectedTutors.map(tutor => (
                    <td key={tutor.id} className="py-4 px-6 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {tutor.languages.map(lang => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Education */}
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">Obrazovanje</span>
                  </td>
                  {selectedTutors.map(tutor => (
                    <td key={tutor.id} className="py-4 px-6 text-center text-sm text-gray-900">
                      {tutor.education}
                    </td>
                  ))}
                </tr>

                {/* Specializations */}
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">Specijalnosti</span>
                  </td>
                  {selectedTutors.map(tutor => (
                    <td key={tutor.id} className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {tutor.specializations.map(spec => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTutors.map(tutor => (
            <Card key={tutor.id} className="p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-4">{tutor.name}</h3>
              <div className="space-y-3">
                <Button className="w-full">Pošalji poruku</Button>
                <Button variant="outline" className="w-full">
                  Pogledaj profil
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
