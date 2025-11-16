'use client'

import React, { useState } from 'react'
import {
  ArrowLeft,
  Award,
  Clock,
  BookOpen,
  CheckCircle,
  Lock,
  Play,
  Users,
  Star,
  TrendingUp,
  Target,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'

interface LearningPathDetailProps {
  params: { id: string }
}

interface CourseInPath {
  id: string
  order: number
  title: string
  description: string
  duration: number
  lessons: number
  completed: boolean
  locked: boolean
  progress: number
  instructor: string
  skills: string[]
}

export default function LearningPathDetailPage({ params }: LearningPathDetailProps) {
  const router = useRouter()
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

  // Mock data
  const path = {
    id: params.id,
    title: 'Web Development - Od nule do heroja',
    description:
      'Kompletan put od HTML/CSS osnova do naprednog React developmenta i backend integracije. Nauči sve potrebno za karijeru u web developmentu kroz strukturirani program koji te vodi korak po korak.',
    level: 'beginner' as const,
    totalCourses: 5,
    totalDuration: 120,
    enrolled: true,
    progress: 45,
    completedCourses: 2,
    certificate: true,
    category: 'Programiranje',
    students: 1234,
    rating: 4.9,
    totalReviews: 234,
    whatYouWillLearn: [
      'HTML5 i CSS3 - od osnova do naprednih tehnika',
      'JavaScript ES6+ i moderan JavaScript development',
      'React.js - components, hooks, state management',
      'Node.js i Express.js za backend development',
      'MongoDB i rad s bazama podataka',
      'Deployment i održavanje web aplikacija',
      'Git, GitHub i kolaboracija na projektima',
      'Best practices i industry standards',
    ],
    prerequisites: [
      'Osnovno poznavanje rada s računalom',
      'Instaliran moderan web browser (Chrome, Firefox)',
      'Text editor (VS Code preporučen)',
      'Motivacija i 10-15 sati tjedno za učenje',
    ],
  }

  const courses: CourseInPath[] = [
    {
      id: 'c1',
      order: 1,
      title: 'HTML & CSS Osnove',
      description:
        'Nauči osnove web developmenta - struktura stranice, styling i responzivni dizajn',
      duration: 20,
      lessons: 15,
      completed: true,
      locked: false,
      progress: 100,
      instructor: 'Marko Novak',
      skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'Responsive Design'],
    },
    {
      id: 'c2',
      order: 2,
      title: 'JavaScript - Od početnika do profesionalca',
      description:
        'Savladaj JavaScript od osnova do naprednih koncepata - ES6+, async/await, DOM manipulation',
      duration: 40,
      lessons: 30,
      completed: true,
      locked: false,
      progress: 100,
      instructor: 'Marko Novak',
      skills: ['ES6+', 'Async/Await', 'Promises', 'DOM', 'Event Handling'],
    },
    {
      id: 'c3',
      order: 3,
      title: 'React.js - Kompletni tečaj',
      description:
        'Nauči React od osnova - components, hooks, state management, routing i deployment',
      duration: 35,
      lessons: 25,
      completed: false,
      locked: false,
      progress: 40,
      instructor: 'Marko Novak',
      skills: ['React', 'Hooks', 'Context API', 'React Router', 'Redux'],
    },
    {
      id: 'c4',
      order: 4,
      title: 'Node.js & Express - Backend Development',
      description: 'Razvij backend aplikacije s Node.js, Express i MongoDB',
      duration: 30,
      lessons: 22,
      completed: false,
      locked: true,
      progress: 0,
      instructor: 'Marko Novak',
      skills: ['Node.js', 'Express', 'REST API', 'Authentication', 'MongoDB'],
    },
    {
      id: 'c5',
      order: 5,
      title: 'Full Stack Project - Portfolio Web App',
      description: 'Izgradi kompletnu web aplikaciju od nule do deployments',
      duration: 25,
      lessons: 18,
      completed: false,
      locked: true,
      progress: 0,
      instructor: 'Marko Novak',
      skills: ['Full Stack', 'Git', 'Deployment', 'Best Practices', 'Testing'],
    },
  ]

  const handleEnroll = () => {
    alert('Uspješno si se upisao/la na put učenja!')
  }

  const handleContinueCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => router.push('/learning-paths')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Natrag na puteve učenja
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary">{path.category}</Badge>
                  <Badge
                    variant="info"
                    className={
                      path.level === 'beginner'
                        ? 'bg-green-100 text-green-700'
                        : path.level === 'intermediate'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }
                  >
                    {path.level === 'beginner'
                      ? 'Početnik'
                      : path.level === 'intermediate'
                      ? 'Srednji'
                      : 'Napredni'}
                  </Badge>
                  {path.certificate && (
                    <Badge variant="warning">
                      <Award className="w-3 h-3 mr-1" />
                      Certifikat
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{path.title}</h1>
                <p className="text-gray-700 leading-relaxed">{path.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">{path.totalCourses} tečaja</p>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">{path.totalDuration}h</p>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">{path.students}</p>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1 fill-current" />
                  <p className="text-sm text-gray-600">
                    {path.rating} ({path.totalReviews})
                  </p>
                </div>
              </div>
            </Card>

            {/* Progress (if enrolled) */}
            {path.enrolled && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  Tvoj napredak
                </h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Ukupno</span>
                    <span className="font-medium">
                      {path.completedCourses}/{path.totalCourses} tečajeva • {path.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{path.completedCourses}</p>
                    <p className="text-sm text-gray-600">Završeno</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {path.totalCourses - path.completedCourses}
                    </p>
                    <p className="text-sm text-gray-600">Preostalo</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {path.totalDuration - (path.totalDuration * path.progress) / 100}h
                    </p>
                    <p className="text-sm text-gray-600">Do kraja</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Learning Roadmap */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary-600" />
                Tvoj put učenja
              </h3>
              <div className="space-y-4">
                {courses.map((course, index) => (
                  <div key={course.id} className="relative">
                    {/* Connector Line */}
                    {index < courses.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200" />
                    )}

                    {/* Course Card */}
                    <div
                      className={`relative bg-white border-2 rounded-lg transition-all ${
                        course.locked
                          ? 'border-gray-200 opacity-60'
                          : course.completed
                          ? 'border-green-300 bg-green-50'
                          : 'border-primary-300 bg-primary-50'
                      }`}
                    >
                      {/* Number Badge */}
                      <div
                        className={`absolute -left-3 top-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white ${
                          course.locked
                            ? 'bg-gray-300 text-gray-600'
                            : course.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-primary-600 text-white'
                        }`}
                      >
                        {course.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : course.locked ? (
                          <Lock className="w-6 h-6" />
                        ) : (
                          course.order
                        )}
                      </div>

                      <div className="p-4 pl-12">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                          </div>
                          {!course.locked && (
                            <button
                              onClick={() => toggleCourseExpand(course.id)}
                              className="ml-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
                            >
                              {expandedCourse === course.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Quick Info */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {course.duration}h
                          </span>
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {course.lessons} lekcija
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {course.instructor}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {!course.locked && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Napredak</span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  course.completed ? 'bg-green-500' : 'bg-primary-500'
                                }`}
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Expanded Content */}
                        {expandedCourse === course.id && (
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Naučit ćeš:
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {course.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-white text-gray-600 text-xs rounded border border-gray-200"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        {!course.locked && (
                          <Button
                            variant={course.completed ? 'outline' : 'primary'}
                            size="sm"
                            className="w-full"
                            icon={
                              course.completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )
                            }
                            onClick={() => handleContinueCourse(course.id)}
                          >
                            {course.completed
                              ? 'Pregledaj ponovno'
                              : course.progress > 0
                              ? 'Nastavi tečaj'
                              : 'Započni tečaj'}
                          </Button>
                        )}

                        {course.locked && (
                          <div className="text-sm text-gray-500 italic">
                            Otključava se nakon završetka prethodnog tečaja
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* What You'll Learn */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Što ćeš naučiti</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {path.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Prerequisites */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Preduvjeti</h3>
              <ul className="space-y-2">
                {path.prerequisites.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              {path.enrolled ? (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Upisan si!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Nastavi s učenjem i dovrši put
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Tvoj napredak</p>
                    <p className="text-3xl font-bold text-primary-600 mb-1">{path.progress}%</p>
                    <p className="text-xs text-gray-500">
                      {path.completedCourses} od {path.totalCourses} tečajeva završeno
                    </p>
                  </div>

                  <Button variant="primary" className="w-full" icon={<Play className="w-5 h-5" />}>
                    Nastavi učenje
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      icon={<Download className="w-4 h-4" />}
                    >
                      Program
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      icon={<Share2 className="w-4 h-4" />}
                    >
                      Podijeli
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <Award className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Započni svoje učenje</h3>
                    <p className="text-sm text-gray-600">
                      Upiši se na ovaj put i započni svoju transformaciju
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tečajeva:</span>
                      <span className="font-medium text-gray-900">{path.totalCourses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Ukupno:</span>
                      <span className="font-medium text-gray-900">{path.totalDuration}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Razina:</span>
                      <span className="font-medium text-gray-900">
                        {path.level === 'beginner'
                          ? 'Početnik'
                          : path.level === 'intermediate'
                          ? 'Srednji'
                          : 'Napredni'}
                      </span>
                    </div>
                    {path.certificate && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Certifikat:</span>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>

                  <Button variant="primary" className="w-full" onClick={handleEnroll}>
                    Upiši se na put
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    💰 30-dana garancija povrata novca
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
