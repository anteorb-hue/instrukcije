'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Save, Upload, X } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import toast from 'react-hot-toast'

export default function EditProfilePage() {
  const { data: session } = useSession()
  const isTutor = session?.user?.role === 'TUTOR'

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    bio: '',
    // Tutor specific
    title: '',
    hourlyRate: '',
    experience: '',
    education: '',
    certifications: [''],
    languages: ['Hrvatski'],
    subjects: [''],
    educationLevels: [],
  })

  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addField = (field: 'certifications' | 'subjects') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    })
  }

  const removeField = (field: 'certifications' | 'subjects', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    })
  }

  const updateField = (field: 'certifications' | 'subjects', index: number, value: string) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({
      ...formData,
      [field]: newArray,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // API call to update profile
      toast.success('Profil uspješno ažuriran!')
    } catch {
      toast.error('Greška pri ažuriranju profila')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Uredi profil</h1>
          <p className="text-gray-600">Ažurirajte svoje informacije</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Profilna slika</h2>
            <div className="flex items-center space-x-6">
              <Avatar
                src={avatarPreview || session?.user?.avatar}
                name={session?.user?.name || ''}
                size="xl"
              />
              <div>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label htmlFor="avatar">
                  <Button type="button" variant="outline" icon={<Upload className="w-4 h-4" />} onClick={() => document.getElementById('avatar')?.click()}>
                    Učitaj sliku
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-2">JPG, PNG ili GIF. Maks 5MB.</p>
              </div>
            </div>
          </Card>

          {/* Basic Info */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Osnovne informacije</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Ime i prezime"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Telefon"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">O meni</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="input-field"
                placeholder="Napišite nešto o sebi..."
              />
            </div>
          </Card>

          {/* Tutor Specific Fields */}
          {isTutor && (
            <>
              <Card>
                <h2 className="text-xl font-bold mb-4">Instruktor informacije</h2>
                <div className="space-y-6">
                  <Input
                    label="Titula/Pozicija"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="npr. Magistar matematike sa 10+ godina iskustva"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Satnica (€)"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    />
                    <Input
                      label="Godine iskustva"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Obrazovanje
                    </label>
                    <textarea
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      rows={3}
                      className="input-field"
                      placeholder="Unesite svoje obrazovanje..."
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-bold mb-4">Certifikati</h2>
                <div className="space-y-3">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={cert}
                        onChange={(e) => updateField('certifications', index, e.target.value)}
                        placeholder="Naziv certifikata"
                      />
                      {formData.certifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField('certifications', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addField('certifications')}
                  >
                    + Dodaj certifikat
                  </Button>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-bold mb-4">Predmeti koje podučavam</h2>
                <div className="space-y-3">
                  {formData.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={subject}
                        onChange={(e) => updateField('subjects', index, e.target.value)}
                        placeholder="Naziv predmeta"
                      />
                      {formData.subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField('subjects', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addField('subjects')}
                  >
                    + Dodaj predmet
                  </Button>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-bold mb-4">Razine podučavanja</h2>
                <div className="space-y-3">
                  {['OSNOVNA_SKOLA', 'SREDNJA_SKOLA', 'FAKULTET', 'OSTALO'].map((level) => (
                    <label key={level} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={formData.educationLevels.includes(level)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              educationLevels: [...formData.educationLevels, level],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              educationLevels: formData.educationLevels.filter((l) => l !== level),
                            })
                          }
                        }}
                      />
                      <span className="text-gray-700">
                        {level === 'OSNOVNA_SKOLA'
                          ? 'Osnovna škola'
                          : level === 'SREDNJA_SKOLA'
                          ? 'Srednja škola'
                          : level === 'FAKULTET'
                          ? 'Fakultet'
                          : 'Ostalo'}
                      </span>
                    </label>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline">
              Otkaži
            </Button>
            <Button type="submit" variant="primary" icon={<Save className="w-5 h-5" />}>
              Spremi promjene
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
