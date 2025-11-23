'use client'

import React, { useState } from 'react'
import {
  Users,
  DollarSign,
  Gift,
  TrendingUp,
  Copy,
  Check,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Star,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Crown,
  Trophy,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'

interface Referral {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'pending' | 'active' | 'completed'
  registeredAt: Date
  firstPurchaseAt?: Date
  totalSpent: number
  yourEarnings: number
}

interface Reward {
  id: string
  title: string
  description: string
  amount: number
  condition: string
  unlocked: boolean
  progress?: number
  target?: number
}

export default function ReferralsPage() {
  const [linkCopied, setLinkCopied] = useState(false)
  // const [showShareModal, setShowShareModal] = useState(false)

  const referralCode = 'ANTE2025'
  const referralLink = `https://instrukcije.hr/register?ref=${referralCode}`

  const referrals: Referral[] = [
    {
      id: '1',
      name: 'Marko Marić',
      email: 'marko.maric@example.com',
      status: 'completed',
      registeredAt: new Date('2024-12-01'),
      firstPurchaseAt: new Date('2024-12-05'),
      totalSpent: 500,
      yourEarnings: 50,
    },
    {
      id: '2',
      name: 'Petra Kovačić',
      email: 'petra.kovacic@example.com',
      status: 'completed',
      registeredAt: new Date('2024-12-10'),
      firstPurchaseAt: new Date('2024-12-12'),
      totalSpent: 800,
      yourEarnings: 80,
    },
    {
      id: '3',
      name: 'Ivan Novak',
      email: 'ivan.novak@example.com',
      status: 'active',
      registeredAt: new Date('2024-12-15'),
      firstPurchaseAt: new Date('2024-12-18'),
      totalSpent: 200,
      yourEarnings: 20,
    },
    {
      id: '4',
      name: 'Laura Babić',
      email: 'laura.babic@example.com',
      status: 'pending',
      registeredAt: new Date('2025-01-10'),
      totalSpent: 0,
      yourEarnings: 0,
    },
    {
      id: '5',
      name: 'Luka Horvat',
      email: 'luka.horvat@example.com',
      status: 'pending',
      registeredAt: new Date('2025-01-12'),
      totalSpent: 0,
      yourEarnings: 0,
    },
  ]

  const rewards: Reward[] = [
    {
      id: 'r1',
      title: 'Prvi prijatelj',
      description: 'Pozovi svog prvog prijatelja',
      amount: 50,
      condition: '1 uspješan referral',
      unlocked: true,
      progress: 1,
      target: 1,
    },
    {
      id: 'r2',
      title: 'Dijeli znanje',
      description: 'Pozovi 5 prijatelja',
      amount: 100,
      condition: '5 uspješnih referrala',
      unlocked: true,
      progress: 5,
      target: 5,
    },
    {
      id: 'r3',
      title: 'Influencer',
      description: 'Pozovi 10 prijatelja',
      amount: 250,
      condition: '10 uspješnih referrala',
      unlocked: false,
      progress: 5,
      target: 10,
    },
    {
      id: 'r4',
      title: 'Ambassador',
      description: 'Pozovi 25 prijatelja',
      amount: 750,
      condition: '25 uspješnih referrala',
      unlocked: false,
      progress: 5,
      target: 25,
    },
    {
      id: 'r5',
      title: 'Legenda',
      description: 'Pozovi 50 prijatelja',
      amount: 2000,
      condition: '50 uspješnih referrala',
      unlocked: false,
      progress: 5,
      target: 50,
    },
  ]

  const leaderboard = [
    { rank: 1, name: 'Ana Horvat', referrals: 87, earnings: 4350 },
    { rank: 2, name: 'Marko Novak', referrals: 65, earnings: 3250 },
    { rank: 3, name: 'Petra Jurić', referrals: 52, earnings: 2600 },
    { rank: 4, name: 'Ivan Petrović', referrals: 41, earnings: 2050 },
    { rank: 5, name: 'Ante Horvat (Ti)', referrals: 5, earnings: 150, isCurrentUser: true },
  ]

  const stats = {
    totalReferrals: referrals.length,
    activeReferrals: referrals.filter((r) => r.status === 'active' || r.status === 'completed')
      .length,
    totalEarnings: referrals.reduce((sum, r) => sum + r.yourEarnings, 0),
    pendingEarnings: referrals
      .filter((r) => r.status === 'pending')
      .reduce((sum, r) => sum + r.yourEarnings, 0),
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Pridruži se Instrukcije.hr')
    const body = encodeURIComponent(
      `Pozdrav!\n\nŽelim te pozvati da se pridružiš Instrukcije.hr - najbolja platforma za online instrukcije!\n\nRegistriraj se putem mog referral linka i ostvarićemo oboje popust:\n${referralLink}\n\nPozdrav!`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      '_blank'
    )
  }

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      '_blank'
    )
  }

  const handleShareTwitter = () => {
    const text = 'Pridruži se Instrukcije.hr i ostvari popust!'
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
        referralLink
      )}`,
      '_blank'
    )
  }

  const handleShareWhatsApp = () => {
    const text = `Pridruži se Instrukcije.hr i ostvari popust! ${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Završeno
          </Badge>
        )
      case 'active':
        return (
          <Badge variant="info">
            <AlertCircle className="w-3 h-3 mr-1" />
            Aktivan
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3 mr-1" />
            Na čekanju
          </Badge>
        )
      default:
        return null
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Award className="w-6 h-6 text-gray-400" />
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-semibold">{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral program</h1>
          <p className="text-gray-600">
            Pozovi prijatelje i zaradite oboje - ti dobivaš 10% od njihove prve uplate!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalReferrals}</p>
            <p className="text-sm text-gray-600">Ukupno poziva</p>
          </Card>
          <Card className="text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.activeReferrals}</p>
            <p className="text-sm text-gray-600">Aktivnih</p>
          </Card>
          <Card className="text-center">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.totalEarnings} kn</p>
            <p className="text-sm text-gray-600">Ukupna zarada</p>
          </Card>
          <Card className="text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.pendingEarnings} kn</p>
            <p className="text-sm text-gray-600">Na čekanju</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Share Your Link */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Gift className="w-6 h-6 mr-2 text-primary-600" />
                Podijeli svoj referral link
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tvoj referral kod
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={referralCode}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg font-semibold"
                  />
                  <Button
                    variant="outline"
                    icon={linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? 'Kopirano!' : 'Kopiraj'}
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tvoj referral link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <Button
                    variant="outline"
                    icon={linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? 'Kopirano!' : 'Kopiraj'}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Podijeli na društvenim mrežama</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center"
                    icon={<Mail className="w-5 h-5" />}
                    onClick={handleShareEmail}
                  >
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center"
                    icon={<Facebook className="w-5 h-5 text-blue-600" />}
                    onClick={handleShareFacebook}
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center"
                    icon={<Twitter className="w-5 h-5 text-blue-400" />}
                    onClick={handleShareTwitter}
                  >
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center"
                    icon={<Linkedin className="w-5 h-5 text-blue-700" />}
                    onClick={handleShareLinkedIn}
                  >
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center"
                    icon={<MessageSquare className="w-5 h-5 text-green-600" />}
                    onClick={handleShareWhatsApp}
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </Card>

            {/* How It Works */}
            <Card className="gradient-bg text-white">
              <h3 className="text-xl font-semibold mb-4">Kako funkcionira?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Podijeli svoj link</h4>
                    <p className="text-sm opacity-90">
                      Pošalji svoj referral link prijateljima emailom, društvenim mrežama ili direktnom porukom
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Prijatelj se registrira</h4>
                    <p className="text-sm opacity-90">
                      Kada se tvoj prijatelj registrira putem tvog linka, automatski ostvaruje 10% popusta
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Zaradite oboje!</h4>
                    <p className="text-sm opacity-90">
                      Ti dobivaš 10% od njihove prve uplate, a oni 10% popusta. Win-win! 🎉
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Your Referrals */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Tvoji pozivi ({referrals.length})
              </h3>
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar src={referral.avatar} name={referral.name} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900">{referral.name}</p>
                        <p className="text-sm text-gray-600">{referral.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(referral.status)}
                          <span className="text-xs text-gray-500">
                            {referral.registeredAt.toLocaleDateString('hr-HR', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">+{referral.yourEarnings} kn</p>
                      <p className="text-xs text-gray-500">Tvoja zarada</p>
                    </div>
                  </div>
                ))}
                {referrals.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Još nemaš poziva</p>
                    <p className="text-sm text-gray-500">
                      Podijeli svoj link da bi zaradio prve bonuse!
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rewards */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Nagrade
              </h3>
              <div className="space-y-3">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`p-3 border-2 rounded-lg ${
                      reward.unlocked
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{reward.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{reward.description}</p>
                      </div>
                      {reward.unlocked && (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-primary-600">+{reward.amount} kn</p>
                      {reward.progress !== undefined && reward.target !== undefined && (
                        <p className="text-xs text-gray-600">
                          {reward.progress}/{reward.target}
                        </p>
                      )}
                    </div>
                    {!reward.unlocked &&
                      reward.progress !== undefined &&
                      reward.target !== undefined && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-primary-600 h-1.5 rounded-full transition-all"
                              style={{
                                width: `${(reward.progress / reward.target) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Leaderboard */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Top referreri
              </h3>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.isCurrentUser
                        ? 'bg-primary-50 border-2 border-primary-300'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div>
                        <p className={`font-medium ${entry.isCurrentUser ? 'text-primary-700' : 'text-gray-900'}`}>
                          {entry.name}
                        </p>
                        <p className="text-xs text-gray-600">{entry.referrals} poziva</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-green-600">{entry.earnings} kn</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Terms */}
            <Card className="bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">Uvjeti programa</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Zarada se isplaćuje nakon prve uplate prijatelja</li>
                <li>• Bonus iznosi 10% od prve uplate</li>
                <li>• Tvoj prijatelj dobiva 10% popusta</li>
                <li>• Neograničen broj poziva</li>
                <li>• Isplata nakon 30 dana od transakcije</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
