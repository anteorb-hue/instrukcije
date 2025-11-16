'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Clock,
  Star,
  Calendar,
  CheckCircle,
  Trophy,
  Flame
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Line, Bar, Radar } from 'recharts'
import {
  LineChart,
  BarChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Mock data
  const stats = {
    totalHours: 42,
    completedSessions: 28,
    currentStreak: 7,
    longestStreak: 14,
    totalXP: 2450,
    level: 12,
    nextLevelXP: 2800,
    achievements: 15,
  }

  const weeklyProgress = [
    { day: 'Pon', hours: 2, sessions: 2 },
    { day: 'Uto', hours: 1.5, sessions: 1 },
    { day: 'Sri', hours: 3, sessions: 2 },
    { day: 'Čet', hours: 2.5, sessions: 2 },
    { day: 'Pet', hours: 2, sessions: 1 },
    { day: 'Sub', hours: 1, sessions: 1 },
    { day: 'Ned', hours: 0, sessions: 0 },
  ]

  const skillsData = [
    { skill: 'Matematika', progress: 85 },
    { skill: 'Fizika', progress: 70 },
    { skill: 'Engleski', progress: 90 },
    { skill: 'Programiranje', progress: 65 },
    { skill: 'Kemija', progress: 75 },
  ]

  const achievements = [
    {
      id: '1',
      title: 'Prvi korak',
      description: 'Završite prvu instrukciju',
      icon: '🎯',
      unlocked: true,
      date: '2025-01-10',
    },
    {
      id: '2',
      title: 'Učenik tjedna',
      description: 'Održite 7-dnevni streak',
      icon: '🔥',
      unlocked: true,
      date: '2025-01-15',
    },
    {
      id: '3',
      title: 'Marljivi učenik',
      description: 'Završite 25 instrukcija',
      icon: '📚',
      unlocked: true,
      date: '2025-01-16',
    },
    {
      id: '4',
      title: 'Perfekcionista',
      description: 'Postignite 100% na testu',
      icon: '⭐',
      unlocked: false,
      date: null,
    },
    {
      id: '5',
      title: 'Maraton učenja',
      description: 'Učite 30 dana uzastopno',
      icon: '🏆',
      unlocked: false,
      date: null,
    },
    {
      id: '6',
      title: 'Majstor jezika',
      description: 'Postignite nivo C1 u jeziku',
      icon: '🌍',
      unlocked: false,
      date: null,
    },
  ]

  const goals = [
    {
      id: '1',
      title: 'Nauči derivacije',
      subject: 'Matematika',
      progress: 75,
      deadline: '2025-02-01',
      status: 'in_progress',
    },
    {
      id: '2',
      title: 'Priprema za maturu',
      subject: 'Engleski',
      progress: 60,
      deadline: '2025-06-01',
      status: 'in_progress',
    },
    {
      id: '3',
      title: 'React za početnike',
      subject: 'Programiranje',
      progress: 100,
      deadline: '2025-01-15',
      status: 'completed',
    },
  ]

  const milestones = [
    { hours: 10, reached: true },
    { hours: 25, reached: true },
    { hours: 50, reached: false },
    { hours: 100, reached: false },
    { hours: 200, reached: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Moj napredak</h1>
          <p className="text-gray-600">Pratite svoj put učenja i postignuća</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
            <p className="text-sm text-gray-600">Ukupno sati</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
            <p className="text-sm text-gray-600">Sesija</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
            <p className="text-sm text-gray-600">Dana streak</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.achievements}</p>
            <p className="text-sm text-gray-600">Postignuća</p>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Level {stats.level}</h2>
              <p className="text-gray-600">
                {stats.totalXP} / {stats.nextLevelXP} XP
              </p>
            </div>
            <div className="text-5xl">🎖️</div>
          </div>
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full gradient-bg transition-all duration-500"
              style={{ width: `${(stats.totalXP / stats.nextLevelXP) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-right">
            {stats.nextLevelXP - stats.totalXP} XP do sljedećeg levela
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Progress */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Tjedni napredak</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" fill="#0ea5e9" name="Sati" />
                  <Bar dataKey="sessions" fill="#d946ef" name="Sesije" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Skills Radar */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Vještine</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Napredak"
                    dataKey="progress"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Goals */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Moji ciljevi</h2>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600">{goal.subject}</p>
                      </div>
                      <Badge
                        variant={goal.status === 'completed' ? 'success' : 'info'}
                      >
                        {goal.status === 'completed' ? 'Završeno' : 'U tijeku'}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Napredak</span>
                        <span className="font-semibold">{goal.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Rok: {new Date(goal.deadline).toLocaleDateString('hr-HR')}
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  + Dodaj novi cilj
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Postignuća</h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border-2 ${
                      achievement.unlocked
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {achievement.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {achievement.description}
                        </p>
                        {achievement.unlocked && achievement.date && (
                          <p className="text-xs text-primary-600 mt-1">
                            Otključano: {new Date(achievement.date).toLocaleDateString('hr-HR')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Milestones */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Prekretnice</h2>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        milestone.reached
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {milestone.reached ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Target className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{milestone.hours} sati</p>
                      <p className="text-xs text-gray-600">
                        {milestone.reached ? 'Postignuto!' : 'Još malo...'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Streak Calendar */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Streak kalendar</h2>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-orange-500 mb-1">
                  🔥 {stats.currentStreak}
                </p>
                <p className="text-sm text-gray-600">Trenutni streak</p>
                <p className="text-xs text-gray-500 mt-2">
                  Najbolji: {stats.longestStreak} dana
                </p>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => {
                  const hasActivity = i >= 28 - stats.currentStreak
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg ${
                        hasActivity
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                      title={hasActivity ? 'Aktivan dan' : 'Neaktivan'}
                    />
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
