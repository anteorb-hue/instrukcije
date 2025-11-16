'use client'

import React from 'react'
import Link from 'next/link'
import { Search, Calendar, Video, Star, Shield, CreditCard, MessageSquare, Bell } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function HowItWorksPage() {
  const forStudents = [
    {
      icon: <Search className="w-12 h-12" />,
      title: '1. Pronađite instruktora',
      description: 'Pretražite našu bazu verificiranih instruktora. Filtrirajte po predmetu, cijeni, rasporedu i ocjeni.',
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: '2. Zakažite termin',
      description: 'Odaberite dostupan termin iz instruktorovog kalendara. Platite sigurno putem Stripe platforme.',
    },
    {
      icon: <Video className="w-12 h-12" />,
      title: '3. Prijavite se na sesiju',
      description: 'Pridružite se video pozivu putem Zoom, Google Meet ili Microsoft Teams u zakazano vrijeme.',
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: '4. Ocijenite instruktora',
      description: 'Nakon sesije, ocijenite instruktora i pomozite drugima u odabiru.',
    },
  ]

  const forTutors = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: '1. Registrujte se',
      description: 'Napravite račun i kreirajte detaljni profil sa svojim obrazovanjem i iskustvom.',
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: '2. Postavite raspored',
      description: 'Označite svoje dostupne termine i sami određujete cijenu svojih usluga.',
    },
    {
      icon: <Bell className="w-12 h-12" />,
      title: '3. Prihvatite rezervacije',
      description: 'Primite notifikaciju kada učenik zakaže termin. Automatski kreiramo video link.',
    },
    {
      icon: <CreditCard className="w-12 h-12" />,
      title: '4. Zarađujte',
      description: 'Primite plaćanje automatski 24 sata nakon održane sesije.',
    },
  ]

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Multi-platforma video',
      description: 'Birajte između Zoom, Google Meet i Microsoft Teams',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Sigurna plaćanja',
      description: 'Stripe integracija za brza i sigurna plaćanja',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Real-time chat',
      description: 'Instant poruke sa instruktorima',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Automatsko planiranje',
      description: 'Sinkronizacija kalendara i podsjetnici',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Sistem recenzija',
      description: 'Transparentne ocjene i povratne informacije',
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Notifikacije',
      description: 'Email i push notifikacije za sve aktivnosti',
    },
  ]

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="gradient-bg text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Kako funkcionira Instrukcije.hr?
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Jednostavna i sigurna platforma za učenje
          </p>
        </div>
      </section>

      {/* For Students */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Za učenike
            </h2>
            <p className="text-xl text-gray-600">
              Kako pronaći i zakazati instrukcije
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {forStudents.map((step, index) => (
              <Card key={index} hover>
                <div className="text-primary-600 mb-4">{step.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/tutors">
              <Button size="lg" variant="primary">
                Pronađi instruktora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Tutors */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Za instruktore
            </h2>
            <p className="text-xl text-gray-600">
              Kako započeti i zarađivati
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {forTutors.map((step, index) => (
              <Card key={index} hover>
                <div className="text-primary-600 mb-4">{step.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/become-tutor">
              <Button size="lg" variant="primary">
                Postani instruktor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Naše funkcionalnosti
            </h2>
            <p className="text-xl text-gray-600">
              Sve što trebate za uspješno učenje
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 gradient-bg rounded-2xl text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Card>
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Sigurnost i privatnost
                  </h2>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span>Svi instruktori su verificirani i provjereni</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span>Sigurna plaćanja putem Stripe platforme</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span>Povrat novca ako niste zadovoljni</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span>24/7 korisnička podrška</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span>Zaštita podataka prema GDPR standardima</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Spremni započeti?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Registrirajte se besplatno i započnite svoje putovanje učenja danas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Registriraj se besplatno
              </Button>
            </Link>
            <Link href="/tutors">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white">
                Pregledaj instruktore
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
