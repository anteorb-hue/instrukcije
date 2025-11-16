'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  User,
  Award,
  Brain,
  Lightbulb,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface LessonNote {
  id: string
  sessionId: string
  date: Date
  subject: string
  tutor: string
  tutorAvatar?: string
  duration: number
  topicsCovered: string[]
  studentPerformance: {
    understanding: number
    participation: number
    homework: number
    overall: number
  }
  strengths: string[]
  areasForImprovement: string[]
  homework: {
    assigned: string[]
    dueDate: Date
    completed: boolean
  }
  teacherNotes: string
  aiInsights: string
  nextSteps: string[]
  materialsUsed: string[]
  rating?: number
}

export default function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [filterSubject, setFilterSubject] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const lessons: LessonNote[] = [
    {
      id: '1',
      sessionId: 'session-123',
      date: new Date('2025-01-15T14:00:00'),
      subject: 'Matematika',
      tutor: 'Ana Horvat',
      duration: 60,
      topicsCovered: [
        'Derivacije elementarnih funkcija',
        'Pravila deriviranja',
        'Primjena derivacija',
      ],
      studentPerformance: {
        understanding: 85,
        participation: 90,
        homework: 75,
        overall: 83,
      },
      strengths: [
        'Brzo shvaća koncepte',
        'Dobro postavlja pitanja',
        'Aktivno sudjeluje u rješavanju zadataka',
      ],
      areasForImprovement: [
        'Potrebno više vježbe s složenijim zadacima',
        'Rad na brzini rješavanja',
      ],
      homework: {
        assigned: [
          'Riješiti zadatke 15-20 iz udžbenika',
          'Pogledati dodatne video lekcije',
          'Pripremiti pitanja za sljedeći sat',
        ],
        dueDate: new Date('2025-01-18'),
        completed: true,
      },
      teacherNotes:
        'Odličan napredak! Student pokazuje veliko zanimanje i razumijevanje gradiva. Preporučujem nastavak s naprednim temama.',
      aiInsights:
        'Student pokazuje napredak od 15% u odnosu na prošlu sesiju. Preporučuje se fokus na praktičnu primjenu derivacija u sljedećih nekoliko sesija.',
      nextSteps: [
        'Nastaviti s integracijama',
        'Riješiti više kompleksnih zadataka',
        'Pripremiti se za test',
      ],
      materialsUsed: ['Derivacije - Kompletni vodič.pdf', 'Kalkulus vježbe.pdf'],
      rating: 5,
    },
    {
      id: '2',
      sessionId: 'session-124',
      date: new Date('2025-01-12T16:00:00'),
      subject: 'Engleski jezik',
      tutor: 'Marko Novak',
      duration: 45,
      topicsCovered: ['Present Perfect tense', 'Vokabular - putovanja', 'Konverzacija'],
      studentPerformance: {
        understanding: 90,
        participation: 95,
        homework: 100,
        overall: 95,
      },
      strengths: [
        'Izvrsna komunikacija',
        'Bogat vokabular',
        'Samopouzdanje pri govoru',
      ],
      areasForImprovement: ['Fini detalji gramatike', 'Korištenje idioma'],
      homework: {
        assigned: [
          'Napisati esej o putovanju (200 riječi)',
          'Naučiti 20 novih fraza',
          'Pogledati film na engleskom',
        ],
        dueDate: new Date('2025-01-15'),
        completed: true,
      },
      teacherNotes:
        'Fantastičan student! Brzo napreduje i ima prirodan talent za jezike.',
      aiInsights:
        'Student postiže iznimne rezultate. Preporučuje se prelazak na C1 nivo u sljedećih 2-3 mjeseca.',
      nextSteps: [
        'Započeti s naprednijom gramatikom',
        'Fokus na poslovni engleski',
        'Pripremiti se za Cambridge ispit',
      ],
      materialsUsed: ['English Grammar.pdf', 'Travel Vocabulary.pdf'],
      rating: 5,
    },
    {
      id: '3',
      sessionId: 'session-125',
      date: new Date('2025-01-10T10:00:00'),
      subject: 'Programiranje',
      tutor: 'Petra Kovačić',
      duration: 90,
      topicsCovered: ['React Hooks - useEffect', 'API integracija', 'Error handling'],
      studentPerformance: {
        understanding: 70,
        participation: 80,
        homework: 60,
        overall: 70,
      },
      strengths: ['Dobro razumijevanje osnovnih koncepata', 'Kreativno razmišljanje'],
      areasForImprovement: [
        'Potrebno više prakse s async operacijama',
        'Debug vještine',
        'Čitanje dokumentacije',
      ],
      homework: {
        assigned: [
          'Dovršiti TODO app s API pozivima',
          'Pročitati React dokumentaciju o useEffect',
          'Implementirati error boundary',
        ],
        dueDate: new Date('2025-01-14'),
        completed: false,
      },
      teacherNotes:
        'Student ima potencijal, ali treba više samostalnog rada. Preporučujem dodatne vježbe između sesija.',
      aiInsights:
        'Identificirano područje za poboljšanje: asinkrono programiranje. Preporučuje se 3-4 dodatne vježbe prije prelaska na sljedeće teme.',
      nextSteps: [
        'Više praktičnih vježbi',
        'Code review sesije',
        'Rad na kompleksnijem projektu',
      ],
      materialsUsed: ['React Hooks - Cheat Sheet.pdf', 'API Guide.pdf'],
      rating: 4,
    },
  ]

  const subjects = Array.from(new Set(lessons.map((l) => l.subject)))

  const filteredLessons =
    filterSubject === 'all'
      ? lessons
      : lessons.filter((l) => l.subject === filterSubject)

  const stats = {
    totalLessons: lessons.length,
    averagePerformance: Math.round(
      lessons.reduce((acc, l) => acc + l.studentPerformance.overall, 0) / lessons.length
    ),
    completedHomework: lessons.filter((l) => l.homework.completed).length,
    totalHours: lessons.reduce((acc, l) => acc + l.duration, 0) / 60,
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 75) return 'bg-blue-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bilješke sa instrukcija
          </h1>
          <p className="text-gray-600">
            Pregledajte detaljan insights i napredak sa svih instrukcija
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <BookOpen className="w-8 h-8 text-primary-600 mb-2" />
              <p className="text-2xl font-bold text-gradient">{stats.totalLessons}</p>
              <p className="text-sm text-gray-600">Ukupno lekcija</p>
            </div>
          </Card>
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.averagePerformance}%</p>
              <p className="text-sm text-gray-600">Prosječna ocjena</p>
            </div>
          </Card>
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {stats.completedHomework}/{stats.totalLessons}
              </p>
              <p className="text-sm text-gray-600">Zadaća gotova</p>
            </div>
          </Card>
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-600">{stats.totalHours.toFixed(1)}h</p>
              <p className="text-sm text-gray-600">Ukupno sati</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          >
            Filteri
          </Button>

          {showFilters && (
            <Card className="mt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterSubject('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterSubject === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Svi predmeti
                </button>
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setFilterSubject(subject)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filterSubject === subject
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Lessons List */}
        <div className="space-y-6">
          {filteredLessons.map((lesson) => {
            const isExpanded = selectedLesson === lesson.id

            return (
              <Card key={lesson.id} className="overflow-hidden">
                {/* Header */}
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setSelectedLesson(isExpanded ? null : lesson.id)}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                        {lesson.tutor.split(' ').map((n) => n[0]).join('')}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lesson.subject}
                        </h3>
                        <Badge variant="info">{lesson.tutor}</Badge>
                        {lesson.rating && (
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm text-gray-600">{lesson.rating}/5</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {lesson.date.toLocaleDateString('hr-HR')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {lesson.duration} min
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getPerformanceBgColor(
                            lesson.studentPerformance.overall
                          )} ${getPerformanceColor(lesson.studentPerformance.overall)}`}
                        >
                          Ocjena: {lesson.studentPerformance.overall}%
                        </span>
                        {lesson.homework.completed ? (
                          <Badge variant="success">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Zadaća gotova
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Zadaća pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="flex-shrink-0 ml-4">
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    {/* AI Insights */}
                    <div className="gradient-bg text-white p-4 rounded-lg">
                      <div className="flex items-start space-x-2 mb-2">
                        <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">AI Insights</h4>
                          <p className="text-white/90 text-sm">{lesson.aiInsights}</p>
                        </div>
                      </div>
                    </div>

                    {/* Topics Covered */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-primary-600" />
                        Pokrivene teme
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {lesson.topicsCovered.map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Performance Breakdown */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        Detaljna ocjena
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(lesson.studentPerformance).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="relative w-20 h-20 mx-auto mb-2">
                              <svg className="w-20 h-20 transform -rotate-90">
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="35"
                                  stroke="#e5e7eb"
                                  strokeWidth="8"
                                  fill="none"
                                />
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="35"
                                  stroke="#0ea5e9"
                                  strokeWidth="8"
                                  fill="none"
                                  strokeDasharray={`${value * 2.2} 220`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-900">{value}%</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 capitalize">
                              {key === 'understanding'
                                ? 'Razumijevanje'
                                : key === 'participation'
                                ? 'Sudjelovanje'
                                : key === 'homework'
                                ? 'Zadaća'
                                : 'Ukupno'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Areas for Improvement */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                          Prednosti
                        </h4>
                        <ul className="space-y-2">
                          {lesson.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-700">
                              <span className="text-green-500 mr-2">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-orange-600" />
                          Za poboljšanje
                        </h4>
                        <ul className="space-y-2">
                          {lesson.areasForImprovement.map((area, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-700">
                              <span className="text-orange-500 mr-2">→</span>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Homework */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-purple-600" />
                        Zadaća
                        <Badge
                          variant={lesson.homework.completed ? 'success' : 'warning'}
                          className="ml-2"
                        >
                          {lesson.homework.completed ? 'Gotovo' : 'Pending'}
                        </Badge>
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="space-y-2 mb-3">
                          {lesson.homework.assigned.map((task, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-700">
                              <span className="mr-2">{idx + 1}.</span>
                              {task}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-gray-600">
                          <strong>Rok:</strong>{' '}
                          {lesson.homework.dueDate.toLocaleDateString('hr-HR')}
                        </p>
                      </div>
                    </div>

                    {/* Teacher Notes */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Bilješke instruktora
                      </h4>
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-gray-700 italic">"{lesson.teacherNotes}"</p>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                        Sljedeći koraci
                      </h4>
                      <ul className="space-y-2">
                        {lesson.nextSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-700">
                            <span className="text-primary-600 mr-2 font-bold">{idx + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Materials Used */}
                    {lesson.materialsUsed.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Korišteni materijali</h4>
                        <div className="flex flex-wrap gap-2">
                          {lesson.materialsUsed.map((material, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                      <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />}>
                        Preuzmi PDF
                      </Button>
                      <Button variant="outline" size="sm" icon={<Share2 className="w-4 h-4" />}>
                        Podijeli
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {filteredLessons.length === 0 && (
          <Card className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Nema pronađenih lekcija</p>
            <p className="text-sm text-gray-500">
              Probajte promijeniti filtere ili zakazati novu instrukciju
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
