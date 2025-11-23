'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API call to send message
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Poruka uspješno poslana! Odgovorit ćemo uskoro.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Greška pri slanju poruke')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kontaktirajte nas</h1>
          <p className="text-xl text-gray-600">
            Rado ćemo odgovoriti na sva vaša pitanja
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">info@instrukcije.hr</p>
                  <p className="text-gray-600">support@instrukcije.hr</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                  <p className="text-gray-600">+385 1 234 5678</p>
                  <p className="text-sm text-gray-500 mt-1">Pon-Pet, 9:00-17:00</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Adresa</h3>
                  <p className="text-gray-600">
                    Ilica 242
                    <br />
                    10000 Zagreb
                    <br />
                    Hrvatska
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Radno vrijeme</h3>
                  <p className="text-gray-600">
                    Ponedjeljak - Petak: 9:00 - 17:00
                    <br />
                    Subota: 10:00 - 14:00
                    <br />
                    Nedjelja: Zatvoreno
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pošaljite nam poruku</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                </div>

                <Input
                  label="Predmet"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poruka
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="input-field"
                    placeholder="Napišite svoju poruku..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={<Send className="w-5 h-5" />}
                  className="w-full"
                >
                  Pošalji poruku
                </Button>
              </form>
            </Card>

            {/* FAQ CTA */}
            <Card className="mt-6">
              <div className="flex items-start space-x-4">
                <MessageSquare className="w-6 h-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Prije nego nas kontaktirate...
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Možda ćete pronaći odgovor u našim Često postavljenim pitanjima.
                  </p>
                  <a href="/faq">
                    <Button variant="outline" size="sm">
                      Pogledaj FAQ
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
