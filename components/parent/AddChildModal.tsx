'use client'

import React, { useState } from 'react'
import { X, AlertCircle, CheckCircle, User, Mail, Lock, Phone, BookOpen, Target } from 'lucide-react'
import Button from '@/components/ui/Button'

interface AddChildModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type Mode = 'create' | 'link'

export default function AddChildModal({ isOpen, onClose, onSuccess }: AddChildModalProps) {
  const [mode, setMode] = useState<Mode>('create')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Create new child
  const [newChildData, setNewChildData] = useState({
    email: '',
    name: '',
    password: '',
    phone: '',
    educationLevel: 'OSNOVNA_SKOLA',
    interests: '',
    learningGoals: '',
    relationship: 'Parent',
    isPrimary: true,
  })

  // Link existing child
  const [linkData, setLinkData] = useState({
    childId: '',
    relationship: 'Parent',
    isPrimary: false,
  })

  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/parents/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newChildData.email,
          name: newChildData.name,
          password: newChildData.password,
          phone: newChildData.phone || undefined,
          educationLevel: newChildData.educationLevel,
          interests: newChildData.interests ? newChildData.interests.split(',').map((s) => s.trim()) : [],
          learningGoals: newChildData.learningGoals || undefined,
          relationship: newChildData.relationship,
          isPrimary: newChildData.isPrimary,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create child')
      }

      setSuccess('Dijete uspješno dodano!')
      setTimeout(() => {
        onSuccess()
        onClose()
        // Reset form
        setNewChildData({
          email: '',
          name: '',
          password: '',
          phone: '',
          educationLevel: 'OSNOVNA_SKOLA',
          interests: '',
          learningGoals: '',
          relationship: 'Parent',
          isPrimary: true,
        })
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Došlo je do greške')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/parents/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: linkData.childId,
          relationship: linkData.relationship,
          isPrimary: linkData.isPrimary,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to link child')
      }

      setSuccess('Dijete uspješno povezano!')
      setTimeout(() => {
        onSuccess()
        onClose()
        // Reset form
        setLinkData({
          childId: '',
          relationship: 'Parent',
          isPrimary: false,
        })
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Došlo je do greške')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-gray-900">Dodaj dijete</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Mode Selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                mode === 'create'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              Kreiraj novi račun
            </button>
            <button
              onClick={() => setMode('link')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                mode === 'link'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              Poveži postojeći račun
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Create New Child Form */}
          {mode === 'create' && (
            <form onSubmit={handleCreateChild} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ime i prezime <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={newChildData.name}
                    onChange={(e) => setNewChildData({ ...newChildData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ana Horvat"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={newChildData.email}
                    onChange={(e) => setNewChildData({ ...newChildData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="ana@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lozinka <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newChildData.password}
                    onChange={(e) => setNewChildData({ ...newChildData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Minimum 6 znakova"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={newChildData.phone}
                    onChange={(e) => setNewChildData({ ...newChildData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+385 91 234 5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razina obrazovanja <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={newChildData.educationLevel}
                    onChange={(e) => setNewChildData({ ...newChildData, educationLevel: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                  >
                    <option value="OSNOVNA_SKOLA">Osnovna škola</option>
                    <option value="SREDNJA_SKOLA">Srednja škola</option>
                    <option value="FAKULTET">Fakultet</option>
                    <option value="OSTALO">Ostalo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interesi (odvojeni zarezom)
                </label>
                <input
                  type="text"
                  value={newChildData.interests}
                  onChange={(e) => setNewChildData({ ...newChildData, interests: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Matematika, Fizika, Programiranje"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciljevi učenja</label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={newChildData.learningGoals}
                    onChange={(e) => setNewChildData({ ...newChildData, learningGoals: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Poboljšati ocjenu iz matematike..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Odnos</label>
                <input
                  type="text"
                  value={newChildData.relationship}
                  onChange={(e) => setNewChildData({ ...newChildData, relationship: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Mother, Father, Guardian..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={newChildData.isPrimary}
                  onChange={(e) => setNewChildData({ ...newChildData, isPrimary: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isPrimary" className="text-sm text-gray-700">
                  Primarni kontakt za ovo dijete
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
                  Odustani
                </Button>
                <Button type="submit" variant="primary" disabled={loading} className="flex-1">
                  {loading ? 'Kreiranje...' : 'Kreiraj dijete'}
                </Button>
              </div>
            </form>
          )}

          {/* Link Existing Child Form */}
          {mode === 'link' && (
            <form onSubmit={handleLinkChild} className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  Unesite ID postojećeg učeničkog računa koji želite povezati sa svojim roditeljskim računom.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID djeteta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={linkData.childId}
                  onChange={(e) => setLinkData({ ...linkData, childId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="clxyz123..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Odnos</label>
                <input
                  type="text"
                  value={linkData.relationship}
                  onChange={(e) => setLinkData({ ...linkData, relationship: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Mother, Father, Guardian..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrimaryLink"
                  checked={linkData.isPrimary}
                  onChange={(e) => setLinkData({ ...linkData, isPrimary: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isPrimaryLink" className="text-sm text-gray-700">
                  Primarni kontakt za ovo dijete
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
                  Odustani
                </Button>
                <Button type="submit" variant="primary" disabled={loading} className="flex-1">
                  {loading ? 'Povezivanje...' : 'Poveži dijete'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
