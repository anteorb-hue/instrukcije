'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Award,
  Gift,
  Star,
  Crown,
  Percent,
  Loader2,
} from 'lucide-react'

interface Reward {
  id: string
  type: string
  title: string
  description: string
  pointsCost: number
  value: number
  userRole: 'TUTOR' | 'STUDENT' | null
  active: boolean
  limitPerUser?: number
  validDays?: number
  icon?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

const REWARD_TYPES = [
  { value: 'VOUCHER', label: 'Voucher', icon: Gift },
  { value: 'DISCOUNT', label: 'Popust', icon: Percent },
  { value: 'COMMISSION_DISCOUNT', label: 'Popust provizije', icon: Percent },
  { value: 'FEATURED', label: 'Featured Status', icon: Star },
  { value: 'FREE_LESSON', label: 'Besplatna instrukcija', icon: Award },
  { value: 'PREMIUM', label: 'Premium', icon: Crown },
]

const ICON_OPTIONS = ['Gift', 'Star', 'Award', 'Crown', 'Percent', 'DollarSign']

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Reward>>({
    type: 'VOUCHER',
    title: '',
    description: '',
    pointsCost: 0,
    value: 0,
    userRole: null,
    active: true,
    validDays: 30,
    icon: 'Gift',
  })

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/rewards')
      if (response.ok) {
        const data = await response.json()
        setRewards(data)
      }
    } catch (error) {
      console.error('Error fetching rewards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchRewards()
        setShowAddForm(false)
        resetForm()
        alert('Nagrada uspješno dodana!')
      } else {
        const error = await response.json()
        alert(error.error || 'Greška pri dodavanju nagrade')
      }
    } catch (error) {
      console.error('Error adding reward:', error)
      alert('Greška pri dodavanju nagrade')
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const reward = rewards.find((r) => r.id === id)
      if (!reward) return

      const response = await fetch(`/api/admin/rewards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reward),
      })

      if (response.ok) {
        await fetchRewards()
        setEditingId(null)
        alert('Nagrada uspješno ažurirana!')
      } else {
        const error = await response.json()
        alert(error.error || 'Greška pri ažuriranju nagrade')
      }
    } catch (error) {
      console.error('Error updating reward:', error)
      alert('Greška pri ažuriranju nagrade')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovu nagradu?')) return

    try {
      const response = await fetch(`/api/admin/rewards/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchRewards()
        alert('Nagrada uspješno obrisana!')
      } else {
        const error = await response.json()
        alert(error.error || 'Greška pri brisanju nagrade')
      }
    } catch (error) {
      console.error('Error deleting reward:', error)
      alert('Greška pri brisanju nagrade')
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/rewards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      })

      if (response.ok) {
        await fetchRewards()
      }
    } catch (error) {
      console.error('Error toggling active:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'VOUCHER',
      title: '',
      description: '',
      pointsCost: 0,
      value: 0,
      userRole: null,
      active: true,
      validDays: 30,
      icon: 'Gift',
    })
  }

  const updateReward = (id: string, field: string, value: string | number | boolean | null) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const getRoleLabel = (role: string | null) => {
    if (role === 'TUTOR') return 'Instruktor'
    if (role === 'STUDENT') return 'Učenik'
    return 'Svi'
  }

  const getRoleBadgeColor = (role: string | null) => {
    if (role === 'TUTOR') return 'bg-blue-100 text-blue-800'
    if (role === 'STUDENT') return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upravljanje nagradama</h1>
          <p className="text-gray-600 mt-1">
            Dodajte, uredite ili uklonite nagrade iz kataloga
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          icon={<Plus className="w-5 h-5" />}
        >
          Dodaj nagradu
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Ukupno nagrada</p>
          <p className="text-2xl font-bold">{rewards.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Aktivne</p>
          <p className="text-2xl font-bold text-green-600">
            {rewards.filter((r) => r.active).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Za instruktore</p>
          <p className="text-2xl font-bold text-blue-600">
            {rewards.filter((r) => r.userRole === 'TUTOR').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Za učenike</p>
          <p className="text-2xl font-bold text-purple-600">
            {rewards.filter((r) => r.userRole === 'STUDENT').length}
          </p>
        </Card>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Dodaj novu nagradu</h2>
            <button
              onClick={() => {
                setShowAddForm(false)
                resetForm()
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tip nagrade</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {REWARD_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Naziv</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="10 EUR Voucher"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Opis</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detaljan opis nagrade..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cijena (bodovi)</label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.pointsCost}
                onChange={(e) =>
                  setFormData({ ...formData, pointsCost: parseInt(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Vrijednost (EUR / %)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: parseFloat(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Za korisnike</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={formData.userRole || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    userRole: e.target.value ? (e.target.value as 'TUTOR' | 'STUDENT') : null,
                  })
                }
              >
                <option value="">Svi</option>
                <option value="TUTOR">Instruktor</option>
                <option value="STUDENT">Učenik</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Trajanje (dani)</label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.validDays || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    validDays: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ikona</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddForm(false)
                resetForm()
              }}
            >
              Odustani
            </Button>
            <Button onClick={handleAdd} icon={<Save className="w-5 h-5" />}>
              Spremi
            </Button>
          </div>
        </Card>
      )}

      {/* Rewards List */}
      <div className="space-y-4">
        {rewards.map((reward) => {
          const isEditing = editingId === reward.id

          return (
            <Card key={reward.id} className={`p-6 ${!reward.active && 'opacity-60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        className="border rounded px-3 py-2"
                        value={reward.title}
                        onChange={(e) => updateReward(reward.id, 'title', e.target.value)}
                        placeholder="Naziv"
                      />
                      <input
                        type="number"
                        className="border rounded px-3 py-2"
                        value={reward.pointsCost}
                        onChange={(e) =>
                          updateReward(reward.id, 'pointsCost', parseInt(e.target.value))
                        }
                        placeholder="Bodovi"
                      />
                      <input
                        type="number"
                        step="0.01"
                        className="border rounded px-3 py-2"
                        value={reward.value}
                        onChange={(e) =>
                          updateReward(reward.id, 'value', parseFloat(e.target.value))
                        }
                        placeholder="Vrijednost"
                      />
                      <textarea
                        className="border rounded px-3 py-2 md:col-span-3"
                        rows={2}
                        value={reward.description}
                        onChange={(e) =>
                          updateReward(reward.id, 'description', e.target.value)
                        }
                        placeholder="Opis"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{reward.title}</h3>
                        <Badge className={getRoleBadgeColor(reward.userRole)}>
                          {getRoleLabel(reward.userRole)}
                        </Badge>
                        <Badge
                          className={
                            reward.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {reward.active ? 'Aktivna' : 'Neaktivna'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{reward.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="font-medium">
                          💰 {reward.pointsCost} bodova
                        </span>
                        <span>📍 Vrijednost: {reward.value}</span>
                        {reward.validDays && <span>⏰ {reward.validDays} dana</span>}
                        <span className="text-xs">Tip: {reward.type}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleUpdate(reward.id)}
                        className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                        title="Spremi"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        title="Odustani"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggleActive(reward.id, reward.active)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          reward.active
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {reward.active ? 'Deaktiviraj' : 'Aktiviraj'}
                      </button>
                      <button
                        onClick={() => setEditingId(reward.id)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                        title="Uredi"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(reward.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        title="Obriši"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )
        })}

        {rewards.length === 0 && (
          <Card className="p-12 text-center text-gray-500">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Nema nagrada u katalogu</p>
            <p className="text-sm mt-1">Kliknite &quot;Dodaj nagradu&quot; za početak</p>
          </Card>
        )}
      </div>
    </div>
  )
}
