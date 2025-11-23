'use client'

import React, { useState } from 'react'
import {
  Award,
  Trophy,
  Star,
  Download,
  Share2,
  Lock,
  CheckCircle,
  Target,
  TrendingUp,
  Calendar,
  Users,
  BookOpen,
  Zap,
  Crown,
  Flame,
  Clock,
  MessageSquare,
  Eye,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'

interface Certificate {
  id: string
  title: string
  description: string
  issueDate: Date
  courseOrLesson: string
  tutor: string
  type: 'course' | 'lesson' | 'achievement'
  verified: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  progress: number
  target: number
  unlocked: boolean
  unlockedDate?: Date
  category: 'learning' | 'social' | 'streak' | 'milestone'
  points: number
}

export default function CertificatesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'certificates' | 'achievements'>('certificates')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterTier, setFilterTier] = useState<string>('all')

  const certificates: Certificate[] = [
    {
      id: '1',
      title: 'React.js - Napredni tečaj',
      description: 'Uspješno završen napredni tečaj React.js-a s ocjenom 95%',
      issueDate: new Date('2025-01-10'),
      courseOrLesson: 'React.js Napredni',
      tutor: 'Marko Novak',
      type: 'course',
      verified: true,
    },
    {
      id: '2',
      title: 'Priprema za maturu - Matematika',
      description: 'Završeno 20 lekcija pripreme za državnu maturu iz matematike',
      issueDate: new Date('2025-01-05'),
      courseOrLesson: 'Maturalna priprema',
      tutor: 'Ana Horvat',
      type: 'course',
      verified: true,
    },
    {
      id: '3',
      title: 'Master učenja',
      description: 'Završeno 50 lekcija na platformi',
      issueDate: new Date('2024-12-20'),
      courseOrLesson: '50 Lekcija Milestone',
      tutor: 'Instrukcije.hr',
      type: 'achievement',
      verified: true,
    },
  ]

  const achievements: Achievement[] = [
    {
      id: 'ach-1',
      title: 'Prvi koraci',
      description: 'Završi svoju prvu lekciju',
      icon: <Star className="w-8 h-8" />,
      tier: 'bronze',
      progress: 1,
      target: 1,
      unlocked: true,
      unlockedDate: new Date('2024-11-15'),
      category: 'learning',
      points: 10,
    },
    {
      id: 'ach-2',
      title: 'Marljiv učenik',
      description: 'Završi 10 lekcija',
      icon: <BookOpen className="w-8 h-8" />,
      tier: 'bronze',
      progress: 10,
      target: 10,
      unlocked: true,
      unlockedDate: new Date('2024-12-01'),
      category: 'learning',
      points: 25,
    },
    {
      id: 'ach-3',
      title: 'Strastveni učenik',
      description: 'Završi 50 lekcija',
      icon: <Trophy className="w-8 h-8" />,
      tier: 'silver',
      progress: 50,
      target: 50,
      unlocked: true,
      unlockedDate: new Date('2024-12-20'),
      category: 'learning',
      points: 100,
    },
    {
      id: 'ach-4',
      title: 'Master učenja',
      description: 'Završi 100 lekcija',
      icon: <Crown className="w-8 h-8" />,
      tier: 'gold',
      progress: 67,
      target: 100,
      unlocked: false,
      category: 'learning',
      points: 250,
    },
    {
      id: 'ach-5',
      title: 'Legenda',
      description: 'Završi 500 lekcija',
      icon: <Award className="w-8 h-8" />,
      tier: 'platinum',
      progress: 67,
      target: 500,
      unlocked: false,
      category: 'learning',
      points: 1000,
    },
    {
      id: 'ach-6',
      title: 'Tjedni ratnik',
      description: 'Odradi lekcije 7 dana zaredom',
      icon: <Flame className="w-8 h-8" />,
      tier: 'bronze',
      progress: 7,
      target: 7,
      unlocked: true,
      unlockedDate: new Date('2024-11-20'),
      category: 'streak',
      points: 30,
    },
    {
      id: 'ach-7',
      title: 'Mjesečni heroj',
      description: 'Odradi lekcije 30 dana zaredom',
      icon: <Zap className="w-8 h-8" />,
      tier: 'silver',
      progress: 15,
      target: 30,
      unlocked: false,
      category: 'streak',
      points: 150,
    },
    {
      id: 'ach-8',
      title: 'Društvena leptir',
      description: 'Napiši 50 poruka na forumu',
      icon: <MessageSquare className="w-8 h-8" />,
      tier: 'silver',
      progress: 32,
      target: 50,
      unlocked: false,
      category: 'social',
      points: 75,
    },
    {
      id: 'ach-9',
      title: 'Ocjenjivač',
      description: 'Ostavi 10 recenzija instruktorima',
      icon: <Star className="w-8 h-8" />,
      tier: 'bronze',
      progress: 10,
      target: 10,
      unlocked: true,
      unlockedDate: new Date('2024-12-10'),
      category: 'social',
      points: 20,
    },
    {
      id: 'ach-10',
      title: 'Rani ptić',
      description: 'Zakaži lekciju prije 8 ujutro',
      icon: <Clock className="w-8 h-8" />,
      tier: 'bronze',
      progress: 3,
      target: 1,
      unlocked: true,
      unlockedDate: new Date('2024-11-18'),
      category: 'milestone',
      points: 15,
    },
    {
      id: 'ach-11',
      title: 'Grupni igrač',
      description: 'Sudjeluj u 5 grupnih lekcija',
      icon: <Users className="w-8 h-8" />,
      tier: 'silver',
      progress: 2,
      target: 5,
      unlocked: false,
      category: 'milestone',
      points: 50,
    },
    {
      id: 'ach-12',
      title: 'Perfekcionista',
      description: 'Postići 100% ocjenu na 5 lekcija',
      icon: <Target className="w-8 h-8" />,
      tier: 'gold',
      progress: 1,
      target: 5,
      unlocked: false,
      category: 'milestone',
      points: 200,
    },
  ]

  const stats = {
    totalCertificates: certificates.length,
    totalAchievements: achievements.filter((a) => a.unlocked).length,
    totalPoints: achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0),
    completionRate: Math.round(
      (achievements.filter((a) => a.unlocked).length / achievements.length) * 100
    ),
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'bg-amber-100 text-amber-700 border-amber-300'
      case 'silver':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'gold':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'platinum':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getTierBadge = (tier: string) => {
    const labels = {
      bronze: 'Bronca',
      silver: 'Srebro',
      gold: 'Zlato',
      platinum: 'Platina',
    }
    return labels[tier as keyof typeof labels] || tier
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return <BookOpen className="w-4 h-4" />
      case 'social':
        return <MessageSquare className="w-4 h-4" />
      case 'streak':
        return <Flame className="w-4 h-4" />
      case 'milestone':
        return <Trophy className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      learning: 'Učenje',
      social: 'Socijalno',
      streak: 'Niz',
      milestone: 'Prekretnica',
    }
    return labels[category as keyof typeof labels] || category
  }

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesCategory = filterCategory === 'all' || achievement.category === filterCategory
    const matchesTier = filterTier === 'all' || achievement.tier === filterTier
    return matchesCategory && matchesTier
  })

  const handleDownloadCertificate = (cert: Certificate) => {
    alert(`Preuzimanje certifikata: ${cert.title}`)
    // In real app: generate PDF and download
  }

  const handleShareCertificate = (cert: Certificate) => {
    alert(`Podijeli certifikat: ${cert.title}`)
    // In real app: open share modal with social media options
  }

  const handleViewCertificate = (certId: string) => {
    router.push(`/certificates/${certId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certifikati i postignuća</h1>
          <p className="text-gray-600">
            Tvoji uspjesi, certifikati i razine napretka
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalCertificates}</p>
            <p className="text-sm text-gray-600">Certifikata</p>
          </Card>
          <Card className="text-center">
            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{stats.totalAchievements}</p>
            <p className="text-sm text-gray-600">Postignuća</p>
          </Card>
          <Card className="text-center">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.totalPoints}</p>
            <p className="text-sm text-gray-600">Bodova</p>
          </Card>
          <Card className="text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.completionRate}%</p>
            <p className="text-sm text-gray-600">Završenost</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('certificates')}
                className={`pb-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'certificates'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Certifikati ({certificates.length})
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`pb-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'achievements'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Postignuća ({achievements.length})
              </button>
            </div>
          </div>
        </div>

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            {certificates.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="relative overflow-hidden">
                    {/* Certificate Header with Gradient */}
                    <div className="gradient-bg text-white p-6 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <Award className="w-12 h-12" />
                        {cert.verified && (
                          <Badge variant="success" className="bg-white/20 border-white/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verificirano
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-1">{cert.title}</h3>
                      <p className="text-sm opacity-90">{cert.description}</p>
                    </div>

                    {/* Certificate Details */}
                    <div className="px-6 pb-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span>{cert.courseOrLesson}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Instruktor: {cert.tutor}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            Izdano:{' '}
                            {cert.issueDate.toLocaleDateString('hr-HR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          icon={<Eye className="w-4 h-4" />}
                          onClick={() => handleViewCertificate(cert.id)}
                        >
                          Pogledaj
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Download className="w-4 h-4" />}
                          onClick={() => handleDownloadCertificate(cert)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Share2 className="w-4 h-4" />}
                          onClick={() => handleShareCertificate(cert)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-2">Nemaš još certifikata</p>
                <p className="text-sm text-gray-500 mb-6">
                  Završi tečaj ili ostvari postignuće za svoj prvi certifikat
                </p>
                <Button variant="primary" onClick={() => router.push('/tutors')}>
                  Pronađi instruktora
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field"
              >
                <option value="all">Sve kategorije</option>
                <option value="learning">Učenje</option>
                <option value="social">Socijalno</option>
                <option value="streak">Niz</option>
                <option value="milestone">Prekretnica</option>
              </select>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="input-field"
              >
                <option value="all">Svi nivoi</option>
                <option value="bronze">Bronca</option>
                <option value="silver">Srebro</option>
                <option value="gold">Zlato</option>
                <option value="platinum">Platina</option>
              </select>
              <div className="flex-1 text-right text-sm text-gray-600">
                {filteredAchievements.length} rezultata
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`relative ${
                    !achievement.unlocked ? 'opacity-75' : ''
                  }`}
                >
                  {/* Locked Overlay */}
                  {!achievement.unlocked && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  )}

                  {/* Achievement Icon */}
                  <div
                    className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border-4 ${getTierColor(
                      achievement.tier
                    )}`}
                  >
                    <div
                      className={achievement.unlocked ? '' : 'opacity-40'}
                    >
                      {achievement.icon}
                    </div>
                  </div>

                  {/* Achievement Info */}
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant="secondary" className={getTierColor(achievement.tier)}>
                        {getTierBadge(achievement.tier)}
                      </Badge>
                      <Badge variant="secondary">
                        {getCategoryIcon(achievement.category)}
                        <span className="ml-1">{getCategoryLabel(achievement.category)}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Napredak</span>
                      <span className="font-medium">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          achievement.unlocked
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500'
                            : 'bg-gray-400'
                        }`}
                        style={{
                          width: `${Math.min(
                            (achievement.progress / achievement.target) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{achievement.points} bodova</span>
                    </div>
                    {achievement.unlocked && achievement.unlockedDate && (
                      <div className="text-xs text-gray-500">
                        {achievement.unlockedDate.toLocaleDateString('hr-HR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Section */}
        <Card className="mt-12 gradient-bg text-white">
          <div className="flex items-start space-x-4">
            <Trophy className="w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Nastavi graditi svoju karijeru!</h3>
              <p className="mb-4 opacity-90">
                Svaki certifikat i postignuće dodaje na tvoj profesionalni profil. Nastavi učiti i
                ostvarivati nove ciljeve!
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 border-white/30"
                  onClick={() => router.push('/tutors')}
                >
                  Pronađi instruktora
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 border-white/30"
                  onClick={() => router.push('/group-lessons')}
                >
                  Grupne lekcije
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
