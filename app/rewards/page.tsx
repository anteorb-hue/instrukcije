'use client'

import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
  Award,
  Gift,
  TrendingUp,
  Star,
  Trophy,
  Users,
  Zap,
  Clock,
  ChevronRight,
  Check,
  Lock,
  Sparkles,
  Target,
  Crown,
  Percent,
  DollarSign,
} from 'lucide-react'

// Mock data - u produkciji dohvaćaj sa servera
const userData = {
  name: 'Ana Horvat',
  role: 'TUTOR',
  totalPoints: 1250,
  currentTier: 'GOLD',
  pointsToNextTier: 1750,
  referralCode: 'ANA-HORVAT-2024',
  totalReferrals: 3,
}

const tiers = [
  {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 499,
    icon: '🥉',
    color: 'from-orange-400 to-orange-600',
    benefits: ['Osnovna vidljivost', 'Standardna podrška'],
  },
  {
    name: 'Silver',
    minPoints: 500,
    maxPoints: 1499,
    icon: '🥈',
    color: 'from-gray-400 to-gray-600',
    benefits: ['+10% vidljivost', 'Prioritet u poruč', 'Silver badge'],
  },
  {
    name: 'Gold',
    minPoints: 1500,
    maxPoints: 2999,
    icon: '🥇',
    color: 'from-yellow-400 to-yellow-600',
    benefits: ['+25% vidljivost', 'Prioritet booking', 'Gold badge', '5% popust provizije'],
  },
  {
    name: 'Platinum',
    minPoints: 3000,
    maxPoints: 4999,
    icon: '💎',
    color: 'from-purple-400 to-purple-600',
    benefits: [
      '+50% vidljivost',
      'Featured preporuke',
      'Platinum badge',
      '10% popust provizije',
      'VIP support',
    ],
  },
  {
    name: 'Elite',
    minPoints: 5000,
    maxPoints: 99999,
    icon: '⭐',
    color: 'from-pink-500 to-purple-600',
    benefits: [
      'Maksimalna vidljivost',
      'Homepage featured',
      'Elite badge',
      '15% popust provizije',
      'Dediciran account manager',
      'Posebne promocije',
    ],
  },
]

const availableRewards = [
  {
    id: '1',
    title: '10 EUR Voucher',
    description: 'Popust na sljedeću instrukciju',
    points: 200,
    type: 'voucher',
    icon: Gift,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: '2',
    title: 'Featured Status',
    description: '7 dana featured na homepage',
    points: 500,
    type: 'featured',
    icon: Star,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: '3',
    title: '5% Popust Provizije',
    description: '1 mjesec smanjene provizije',
    points: 500,
    type: 'discount',
    icon: Percent,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: '4',
    title: 'Besplatna Instrukcija',
    description: 'Do 25 EUR vrijednosti',
    points: 500,
    type: 'free_lesson',
    icon: Award,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: '5',
    title: '30 EUR Voucher',
    description: 'Veliki popust za lojalne korisnike',
    points: 1000,
    type: 'voucher',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: '6',
    title: 'Premium Profil',
    description: '6 mjeseci besplatno',
    points: 10000,
    type: 'premium',
    icon: Crown,
    color: 'bg-purple-100 text-purple-600',
  },
]

const pointsHistory = [
  {
    id: '1',
    points: 15,
    type: 'earned',
    reason: 'Završena instrukcija - Matematika',
    date: new Date('2025-01-12'),
  },
  {
    id: '2',
    points: 5,
    type: 'earned',
    reason: 'Odlična ocjena (5⭐) od učenika',
    date: new Date('2025-01-12'),
  },
  {
    id: '3',
    points: 3,
    type: 'earned',
    reason: 'Brza reakcija na upit (<30min)',
    date: new Date('2025-01-11'),
  },
  {
    id: '4',
    points: -20,
    type: 'penalty',
    reason: 'Otkazivanje instrukcije u zadnji čas',
    date: new Date('2025-01-10'),
  },
  {
    id: '5',
    points: 10,
    type: 'earned',
    reason: 'Završena instrukcija - Fizika',
    date: new Date('2025-01-09'),
  },
  {
    id: '6',
    points: 50,
    type: 'earned',
    reason: 'Referral bonus - Novi učenik se registrirao',
    date: new Date('2025-01-08'),
  },
]

export default function RewardsPage() {
  const [showReferral, setShowReferral] = useState(false)
  const [selectedReward, setSelectedReward] = useState<string | null>(null)

  const currentTierIndex = tiers.findIndex((tier) => tier.name.toUpperCase() === userData.currentTier)
  const currentTier = tiers[currentTierIndex]
  const nextTier = tiers[currentTierIndex + 1]

  const progressToNextTier = nextTier
    ? ((userData.totalPoints - currentTier.minPoints) /
        (nextTier.minPoints - currentTier.minPoints)) *
      100
    : 100

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('hr-HR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleRedeemReward = (rewardId: string, points: number) => {
    if (userData.totalPoints >= points) {
      // TODO: Implement API call to redeem reward
      alert(`Uspješno ste iskoristili nagradu! Oduzeto ${points} bodova.`)
      setSelectedReward(null)
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(
      `https://instrukcije.hr/ref/${userData.referralCode}`
    )
    alert('Referral link kopiran u clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎁 Nagrade i Bodovi
          </h1>
          <p className="text-lg text-gray-600">
            Zarađuj bodove, ostvari benefite i rasti sa nama!
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Points */}
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-700 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6" />
              </div>
              <Sparkles className="h-6 w-6 text-purple-200" />
            </div>
            <p className="text-sm text-purple-100 mb-1">Ukupno Bodova</p>
            <p className="text-4xl font-bold mb-2">{userData.totalPoints.toLocaleString()}</p>
            <div className="flex items-center text-sm text-purple-100">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+125 ovaj mjesec</span>
            </div>
          </Card>

          {/* Current Tier */}
          <Card className={`p-6 bg-gradient-to-br ${currentTier.color} text-white`}>
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6" />
              </div>
              <span className="text-3xl">{currentTier.icon}</span>
            </div>
            <p className="text-sm opacity-90 mb-1">Trenutni Rang</p>
            <p className="text-4xl font-bold mb-2">{currentTier.name}</p>
            <div className="flex items-center text-sm opacity-90">
              <Crown className="h-4 w-4 mr-1" />
              <span>{currentTier.benefits.length} benefita</span>
            </div>
          </Card>

          {/* Referrals */}
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <Gift className="h-6 w-6 text-blue-200" />
            </div>
            <p className="text-sm text-blue-100 mb-1">Referrals</p>
            <p className="text-4xl font-bold mb-2">{userData.totalReferrals}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-white border-white/30 hover:bg-white/20"
              onClick={() => setShowReferral(!showReferral)}
            >
              <Zap className="h-4 w-4 mr-2" />
              Pozovi prijatelja
            </Button>
          </Card>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Napredak do {nextTier.name} ranga
                </h3>
                <p className="text-sm text-gray-600">
                  Još {userData.pointsToNextTier} bodova do sljedećeg nivoa
                </p>
              </div>
              <span className="text-4xl">{nextTier.icon}</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 bg-gradient-to-r ${nextTier.color} transition-all duration-500`}
                  style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow-md">
                  {Math.round(progressToNextTier)}%
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Referral Section */}
        {showReferral && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pozovi prijatelja i zaradite oboje!
                </h3>
                <p className="text-gray-600 mb-4">
                  Podijeli svoj referral link i osvoji <strong>50 bodova</strong> + <strong>10 EUR credit</strong> kada se registriraju!
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={`https://instrukcije.hr/ref/${userData.referralCode}`}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white font-mono text-sm"
                  />
                  <Button onClick={copyReferralCode}>
                    Kopiraj Link
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Rewards */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💎 Dostupne Nagrade
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableRewards.map((reward) => {
                  const Icon = reward.icon
                  const canAfford = userData.totalPoints >= reward.points

                  return (
                    <Card
                      key={reward.id}
                      className={`p-6 hover:shadow-lg transition-shadow ${
                        !canAfford ? 'opacity-50' : 'cursor-pointer'
                      }`}
                      onClick={() => canAfford && setSelectedReward(reward.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`h-12 w-12 ${reward.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {!canAfford && (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{reward.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-purple-600">
                            {reward.points} bodova
                          </span>
                        </div>
                        {canAfford && (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Points History */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📊 Povijest Bodova
              </h2>
              <Card className="overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {pointsHistory.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">
                            {transaction.reason}
                          </p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1 font-semibold ${
                            transaction.type === 'earned'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          <span className="text-lg">
                            {transaction.type === 'earned' ? '+' : ''}
                            {transaction.points}
                          </span>
                          <Trophy className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar: Tiers & Benefits */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🏆 Rangovi
              </h2>
              <div className="space-y-3">
                {tiers.map((tier, index) => {
                  const isCurrentTier = tier.name.toUpperCase() === userData.currentTier
                  const isUnlocked = userData.totalPoints >= tier.minPoints

                  return (
                    <Card
                      key={tier.name}
                      className={`p-4 ${
                        isCurrentTier
                          ? `bg-gradient-to-br ${tier.color} text-white`
                          : isUnlocked
                          ? 'bg-gray-50'
                          : 'opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{tier.icon}</span>
                        <div>
                          <p className={`font-semibold ${isCurrentTier ? 'text-white' : 'text-gray-900'}`}>
                            {tier.name}
                          </p>
                          <p className={`text-xs ${isCurrentTier ? 'text-white/80' : 'text-gray-600'}`}>
                            {tier.minPoints}+ bodova
                          </p>
                        </div>
                        {isCurrentTier && (
                          <Badge className="ml-auto bg-white/20 text-white border-white/30">
                            Trenutni
                          </Badge>
                        )}
                      </div>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            className={`text-sm flex items-center gap-2 ${
                              isCurrentTier ? 'text-white/90' : 'text-gray-600'
                            }`}
                          >
                            <Check className="h-3 w-3 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* How to Earn Points */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Kako Zaraditi Bodove?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>10 bodova</strong> - Završena instrukcija</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>5 bodova</strong> - Odlična ocjena (5⭐)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>3 boda</strong> - Brza reakcija (&lt;30min)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>50 bodova</strong> - Referral novi korisnik</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>20 bodova</strong> - Dosljednost (10+ mjesečno)</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Reward Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6">
            {(() => {
              const reward = availableRewards.find((r) => r.id === selectedReward)
              if (!reward) return null
              const Icon = reward.icon

              return (
                <>
                  <div className="flex items-center justify-center mb-4">
                    <div className={`h-16 w-16 ${reward.color} rounded-full flex items-center justify-center`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    {reward.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {reward.description}
                  </p>
                  <div className="bg-purple-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Cijena:</span>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-purple-600 text-lg">
                          {reward.points} bodova
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-200">
                      <span className="text-gray-700">Nakon iskoristavanja:</span>
                      <span className="font-semibold text-gray-900">
                        {userData.totalPoints - reward.points} bodova
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedReward(null)}
                    >
                      Odustani
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => handleRedeemReward(reward.id, reward.points)}
                    >
                      Iskoristi
                    </Button>
                  </div>
                </>
              )
            })()}
          </Card>
        </div>
      )}
    </div>
  )
}
