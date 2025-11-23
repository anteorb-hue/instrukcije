'use client'

import React, { useState } from 'react'
import { Bell, Lock, Globe, Shield, Mail } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailMessages: true,
    emailReviews: true,
    pushBookings: true,
    pushMessages: true,
    smsReminders: false,
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handleNotificationChange = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    })
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      toast.error('Lozinke se ne podudaraju')
      return
    }
    try {
      // API call
      toast.success('Lozinka uspješno promijenjena!')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error) {
      toast.error('Greška pri promjeni lozinke')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Postavke</h1>
          <p className="text-gray-600">Upravljajte svojim postavkama računa</p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Notifikacije</h2>
                <p className="text-sm text-gray-600">Upravljajte kako primati obavijesti</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Email - Nove rezervacije</p>
                  <p className="text-sm text-gray-500">Primajte email kad netko zakaže instrukciju</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailBookings}
                    onChange={() => handleNotificationChange('emailBookings')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Email - Nove poruke</p>
                  <p className="text-sm text-gray-500">Primajte email za nove poruke</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailMessages}
                    onChange={() => handleNotificationChange('emailMessages')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Email - Nove recenzije</p>
                  <p className="text-sm text-gray-500">Primajte email kad dobijete recenziju</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailReviews}
                    onChange={() => handleNotificationChange('emailReviews')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Push notifikacije</p>
                  <p className="text-sm text-gray-500">Primajte push notifikacije u browseru</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.pushBookings}
                    onChange={() => handleNotificationChange('pushBookings')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">SMS podsjetniciSMS podsjetnici</p>
                  <p className="text-sm text-gray-500">Primajte SMS podsjetnike za sesije</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.smsReminders}
                    onChange={() => handleNotificationChange('smsReminders')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Password */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Sigurnost</h2>
                <p className="text-sm text-gray-600">Promijenite lozinku</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                type="password"
                label="Trenutna lozinka"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                required
              />
              <Input
                type="password"
                label="Nova lozinka"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                required
              />
              <Input
                type="password"
                label="Potvrdi novu lozinku"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                required
              />
              <Button type="submit" variant="primary">
                Promijeni lozinku
              </Button>
            </form>
          </Card>

          {/* Language & Region */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Jezik i regija</h2>
                <p className="text-sm text-gray-600">Odaberite jezik i vremensku zonu</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jezik</label>
                <select className="input-field">
                  <option value="hr">Hrvatski</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vremenska zona
                </label>
                <select className="input-field">
                  <option value="Europe/Zagreb">Europe/Zagreb (GMT+1)</option>
                  <option value="Europe/Belgrade">Europe/Belgrade (GMT+1)</option>
                  <option value="Europe/Vienna">Europe/Vienna (GMT+1)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-red-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-600">Opasna zona</h2>
                <p className="text-sm text-gray-600">Trajne akcije</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Deaktiviraj račun</p>
                  <p className="text-sm text-gray-500">
                    Privremeno deaktivirajte svoj račun
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Deaktiviraj
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-200 pt-3">
                <div>
                  <p className="font-medium text-red-600">Izbriši račun</p>
                  <p className="text-sm text-gray-500">Trajno izbrišite svoj račun i sve podatke</p>
                </div>
                <Button variant="danger" size="sm">
                  Izbriši račun
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
