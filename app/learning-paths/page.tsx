'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Users,
  Star,
  CheckCircle,
  Lock,
  Play,
  Target,
  Zap,
  BarChart,
  Filter,
  Search,
  ArrowRight,
  Layers,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  description: string
  subject: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // total hours
  totalLessons: number
  completedLessons: number
  enrolled: boolean
  progress: number
  instructor: {
    id: string
    name: string
    avatar?: string
    rating: number
  }
  price: number
  originalPrice?: number
  rating: number
  totalReviews: number
  students: number
  modules: number
  skills: string[]
  certificate: boolean
  lastUpdated: Date
  thumbnail?: string
}

interface LearningPath {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  totalCourses: number
  totalDuration: number
  enrolled: boolean
  progress: number
  completedCourses: number
  courses: string[] // course IDs
  skills: string[]
  certificate: boolean
  category: string
}

export default function LearningPathsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'paths' | 'courses'>('paths')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [filterEnrolled, setFilterEnrolled] = useState<string>('all')

  const learningPaths: LearningPath[] = [
    {
      id: 'path-1',
      title: 'Web Development - Od nule do heroja',
      description: 'Kompletan put od HTML/CSS osnova do naprednog React developmenta i backend integracije',
      level: 'beginner',
      totalCourses: 5,
      totalDuration: 120,
      enrolled: true,
      progress: 45,
      completedCourses: 2,
      courses: ['c1', 'c2', 'c3', 'c4', 'c5'],
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
      certificate: true,
      category: 'Programiranje',
    },
    {
      id: 'path-2',
      title: 'Data Science & Machine Learning',
      description: 'Od Python osnova do naprednih ML modela i deployment-a u produkciju',
      level: 'intermediate',
      totalCourses: 6,
      totalDuration: 150,
      enrolled: false,
      progress: 0,
      completedCourses: 0,
      courses: ['c6', 'c7', 'c8', 'c9', 'c10', 'c11'],
      skills: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow', 'Deep Learning'],
      certificate: true,
      category: 'Programiranje',
    },
    {
      id: 'path-3',
      title: 'Pripreme za maturu - Matematika',
      description: 'Sveobuhvatna priprema za državnu maturu iz matematike s praktičnim zadacima',
      level: 'advanced',
      totalCourses: 4,
      totalDuration: 80,
      enrolled: true,
      progress: 75,
      completedCourses: 3,
      courses: ['c12', 'c13', 'c14', 'c15'],
      skills: ['Funkcije', 'Derivacije', 'Integrali', 'Vjerojatnost', 'Geometrija'],
      certificate: true,
      category: 'Matematika',
    },
    {
      id: 'path-4',
      title: 'Engleski jezik - B1 do C1',
      description: 'Strukturirani put za napredovanje od B1 do C1 razine s fokus na konverzaciju',
      level: 'intermediate',
      totalCourses: 3,
      totalDuration: 90,
      enrolled: false,
      progress: 0,
      completedCourses: 0,
      courses: ['c16', 'c17', 'c18'],
      skills: ['Grammar', 'Vocabulary', 'Speaking', 'Writing', 'Business English'],
      certificate: true,
      category: 'Engleski jezik',
    },
  ]

  const courses: Course[] = [
    {
      id: 'c1',
      title: 'HTML & CSS Osnove',
      description: 'Nauči osnove web developmenta - struktura stranice, styling i responzivni dizajn',
      subject: 'Programiranje',
      level: 'beginner',
      duration: 20,
      totalLessons: 15,
      completedLessons: 15,
      enrolled: true,
      progress: 100,
      instructor: {
        id: 'i1',
        name: 'Marko Novak',
        rating: 4.9,
      },
      price: 299,
      originalPrice: 499,
      rating: 4.8,
      totalReviews: 156,
      students: 1234,
      modules: 5,
      skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'Responsive Design'],
      certificate: true,
      lastUpdated: new Date('2024-12-01'),
    },
    {
      id: 'c2',
      title: 'JavaScript - Od početnika do profesionalca',
      description: 'Savladaj JavaScript od osnova do naprednih koncepata - ES6+, async/await, DOM manipulation',
      subject: 'Programiranje',
      level: 'intermediate',
      duration: 40,
      totalLessons: 30,
      completedLessons: 12,
      enrolled: true,
      progress: 40,
      instructor: {
        id: 'i1',
        name: 'Marko Novak',
        rating: 4.9,
      },
      price: 599,
      originalPrice: 899,
      rating: 4.9,
      totalReviews: 234,
      students: 987,
      modules: 8,
      skills: ['ES6+', 'Async/Await', 'Promises', 'DOM', 'Event Handling'],
      certificate: true,
      lastUpdated: new Date('2025-01-05'),
    },
    {
      id: 'c3',
      title: 'React.js - Kompletni tečaj',
      description: 'Nauči React od osnova - components, hooks, state management, routing i deployment',
      subject: 'Programiranje',
      level: 'intermediate',
      duration: 35,
      totalLessons: 25,
      completedLessons: 0,
      enrolled: false,
      progress: 0,
      instructor: {
        id: 'i1',
        name: 'Marko Novak',
        rating: 4.9,
      },
      price: 699,
      rating: 5.0,
      totalReviews: 189,
      students: 876,
      modules: 7,
      skills: ['React', 'Hooks', 'Context API', 'React Router', 'Redux'],
      certificate: true,
      lastUpdated: new Date('2025-01-10'),
    },
    {
      id: 'c12',
      title: 'Funkcije i granice',
      description: 'Sve vrste funkcija, svojstva i granice - priprema za maturu',
      subject: 'Matematika',
      level: 'advanced',
      duration: 20,
      totalLessons: 18,
      completedLessons: 18,
      enrolled: true,
      progress: 100,
      instructor: {
        id: 'i2',
        name: 'Ana Horvat',
        rating: 4.8,
      },
      price: 399,
      rating: 4.7,
      totalReviews: 98,
      students: 456,
      modules: 6,
      skills: ['Linearne funkcije', 'Kvadratne funkcije', 'Eksponencijalne', 'Granice'],
      certificate: true,
      lastUpdated: new Date('2024-11-15'),
    },
    {
      id: 'c13',
      title: 'Derivacije i primjena',
      description: 'Pravila deriviranja, ispitivanje tijeka funkcije i praktična primjena',
      subject: 'Matematika',
      level: 'advanced',
      duration: 25,
      totalLessons: 20,
      completedLessons: 20,
      enrolled: true,
      progress: 100,
      instructor: {
        id: 'i2',
        name: 'Ana Horvat',
        rating: 4.8,
      },
      price: 449,
      rating: 4.9,
      totalReviews: 87,
      students: 423,
      modules: 7,
      skills: ['Pravila deriviranja', 'Ekstremumi', 'Tangente', 'Optimizacija'],
      certificate: true,
      lastUpdated: new Date('2024-12-01'),
    },
    {
      id: 'c14',
      title: 'Integrali',
      description: 'Neodređeni i određeni integrali, površine i volumen',
      subject: 'Matematika',
      level: 'advanced',
      duration: 20,
      totalLessons: 16,
      completedLessons: 12,
      enrolled: true,
      progress: 75,
      instructor: {
        id: 'i2',
        name: 'Ana Horvat',
        rating: 4.8,
      },
      price: 399,
      rating: 4.8,
      totalReviews: 76,
      students: 398,
      modules: 5,
      skills: ['Neodređeni integrali', 'Određeni integrali', 'Površine', 'Volumen'],
      certificate: true,
      lastUpdated: new Date('2024-12-15'),
    },
  ]

  const categories = Array.from(new Set([...learningPaths.map((p) => p.category), ...courses.map((c) => c.subject)]))

  const filteredPaths = learningPaths.filter((path) => {
    const matchesSearch =
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || path.level === selectedLevel
    const matchesEnrolled =
      filterEnrolled === 'all' ||
      (filterEnrolled === 'enrolled' && path.enrolled) ||
      (filterEnrolled === 'not-enrolled' && !path.enrolled)
    return matchesSearch && matchesCategory && matchesLevel && matchesEnrolled
  })

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.subject === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    const matchesEnrolled =
      filterEnrolled === 'all' ||
      (filterEnrolled === 'enrolled' && course.enrolled) ||
      (filterEnrolled === 'not-enrolled' && !course.enrolled)
    return matchesSearch && matchesCategory && matchesLevel && matchesEnrolled
  })

  const stats = {
    totalPaths: learningPaths.length,
    enrolledPaths: learningPaths.filter((p) => p.enrolled).length,
    totalCourses: courses.length,
    enrolledCourses: courses.filter((c) => c.enrolled).length,
    avgProgress: Math.round(
      learningPaths.filter((p) => p.enrolled).reduce((sum, p) => sum + p.progress, 0) /
        learningPaths.filter((p) => p.enrolled).length || 0
    ),
  }

  const getLevelBadge = (level: string) => {
    const labels = {
      beginner: 'Početnik',
      intermediate: 'Srednji',
      advanced: 'Napredni',
    }
    return labels[level as keyof typeof labels] || level
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700'
      case 'intermediate':
        return 'bg-blue-100 text-blue-700'
      case 'advanced':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Putevi učenja i tečajevi</h1>
          <p className="text-gray-600">
            Strukturirano učenje kroz cjelovite puteve i pojedinačne tečajeve
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalPaths}</p>
            <p className="text-sm text-gray-600">Puteva učenja</p>
          </Card>
          <Card className="text-center">
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.totalCourses}</p>
            <p className="text-sm text-gray-600">Tečajeva</p>
          </Card>
          <Card className="text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.enrolledPaths}</p>
            <p className="text-sm text-gray-600">Upisanih puteva</p>
          </Card>
          <Card className="text-center">
            <Play className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.enrolledCourses}</p>
            <p className="text-sm text-gray-600">Aktivnih tečajeva</p>
          </Card>
          <Card className="text-center">
            <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{stats.avgProgress}%</p>
            <p className="text-sm text-gray-600">Prosječan napredak</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('paths')}
                className={`pb-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'paths'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Putevi učenja ({learningPaths.length})
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`pb-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'courses'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Pojedinačni tečajevi ({courses.length})
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Pretraži..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">Sve kategorije</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="input-field"
            >
              <option value="all">Sve razine</option>
              <option value="beginner">Početnik</option>
              <option value="intermediate">Srednji</option>
              <option value="advanced">Napredni</option>
            </select>

            <select
              value={filterEnrolled}
              onChange={(e) => setFilterEnrolled(e.target.value)}
              className="input-field"
            >
              <option value="all">Svi</option>
              <option value="enrolled">Upisani</option>
              <option value="not-enrolled">Neupisani</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              {activeTab === 'paths' ? filteredPaths.length : filteredCourses.length} rezultata
            </div>
          </div>
        </div>

        {/* Learning Paths Tab */}
        {activeTab === 'paths' && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPaths.map((path) => (
              <Card
                key={path.id}
                hover
                className="cursor-pointer"
                onClick={() => router.push(`/learning-paths/${path.id}`)}
              >
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className={getLevelColor(path.level)}>
                      {getLevelBadge(path.level)}
                    </Badge>
                    {path.certificate && (
                      <Badge variant="warning">
                        <Award className="w-3 h-3 mr-1" />
                        Certifikat
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{path.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{path.description}</p>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Layers className="w-4 h-4 mr-2" />
                    <span>{path.totalCourses} tečajeva</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{path.totalDuration}h</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Naučit ćeš:</p>
                  <div className="flex flex-wrap gap-1">
                    {path.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {path.skills.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{path.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress or CTA */}
                {path.enrolled ? (
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Napredak</span>
                      <span className="font-medium">
                        {path.completedCourses}/{path.totalCourses} tečajeva • {path.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <Button variant="primary" className="w-full" icon={<Play className="w-5 h-5" />}>
                    Započni put
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                hover
                className="cursor-pointer"
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className={getLevelColor(course.level)}>
                      {getLevelBadge(course.level)}
                    </Badge>
                    {course.enrolled && (
                      <Badge variant="success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Upisan
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                </div>

                {/* Instructor */}
                <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm">
                    {course.instructor.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{course.instructor.name}</p>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">{course.instructor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}h</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{course.totalLessons} lekcija</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current text-yellow-500" />
                    <span>{course.rating} ({course.totalReviews})</span>
                  </div>
                </div>

                {/* Progress or Price */}
                {course.enrolled ? (
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Napredak</span>
                      <span className="font-medium">
                        {course.completedLessons}/{course.totalLessons} • {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{course.price} kn</p>
                      {course.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {course.originalPrice} kn
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Vidi detalje
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-12 gradient-bg text-white">
          <div className="flex items-start space-x-4">
            <Zap className="w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Zašto odabrati puteve učenja?</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Strukturirano učenje</strong> - Tečajevi složeni u logičan redoslijed za najbolje rezultate
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Praćenje napretka</strong> - Vidi koliko si postigao/la i što te čeka
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Certifikati</strong> - Certificirani putevi učenja za tvoj CV
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Fleksibilnost</strong> - Uči vlastitim tempom, bilo kad i bilo gdje
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
