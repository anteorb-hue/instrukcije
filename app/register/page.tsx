'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, User, UserPlus, BookOpen, Gift } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    referralCode: '',
  })

  // Check for referral code in URL params
  useEffect(() => {
    const refCode = searchParams.get('ref')
    if (refCode) {
      setFormData((prev) => ({ ...prev, referralCode: refCode }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Lozinke se ne podudaraju')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Lozinka mora imati najmanje 8 znakova')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          referralCode: formData.referralCode || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Greška pri registraciji')
      }

      toast.success('Uspješna registracija! Prijavite se.')
      router.push('/login')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Došlo je do greške'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-gradient">Instrukcije.hr</span>
        </Link>

        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kreirajte račun</h1>
          <p className="text-gray-600 mb-6">Registrirajte se i započnite učenje</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Ime i prezime"
              placeholder="Ana Horvat"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User className="w-5 h-5" />}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="vas@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              type="password"
              label="Lozinka"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            <Input
              type="password"
              label="Potvrdite lozinku"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registriram se kao
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.role === 'STUDENT'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎓</div>
                    <div className="font-semibold">Učenik</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'TUTOR' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.role === 'TUTOR'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">👨‍🏫</div>
                    <div className="font-semibold">Instruktor</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <Input
                type="text"
                label="Referral kod (opcionalno)"
                placeholder="XXXX-XXXX-XXXX"
                value={formData.referralCode}
                onChange={(e) =>
                  setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })
                }
                icon={<Gift className="w-5 h-5" />}
              />
              {formData.referralCode && (
                <p className="text-xs text-green-600 mt-1">
                  🎁 S referral kodom dobivate bonus bodove pri registraciji!
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input type="checkbox" className="mt-1 rounded border-gray-300" required />
              <span className="text-sm text-gray-600">
                Prihvaćam{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                  uvjete korištenja
                </Link>{' '}
                i{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                  politiku privatnosti
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              icon={<UserPlus className="w-5 h-5" />}
            >
              Registriraj se
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Već imate račun?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Prijavite se
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
