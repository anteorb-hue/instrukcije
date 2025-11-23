'use client'

import React from 'react'
import Link from 'next/link'
import { Search, Video, Calendar, Star, Shield, Award, Users, TrendingUp } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function HomePage() {
  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Multi-platforma video pozivi',
      description: 'Zoom, Google Meet i Microsoft Teams integracija za najbolje iskustvo učenja',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Lako zakazivanje',
      description: 'Automatsko planiranje, podsjetnici i sinkronizacija kalendara',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Sigurna plaćanja',
      description: 'Stripe integracija za sigurne i brze transakcije',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Verificirani instruktori',
      description: 'Svi instruktori su provjereni sa validiranim certifikatima',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Real-time chat',
      description: 'Instant poruke sa instruktorima za brzu komunikaciju',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Praćenje napretka',
      description: 'Statistike i izvještaji o vašem učenju i napretku',
    },
  ]

  const subjects = [
    { name: 'Matematika', count: '150+ instruktora', icon: '📐' },
    { name: 'Engleski jezik', count: '120+ instruktora', icon: '🇬🇧' },
    { name: 'Programiranje', count: '90+ instruktora', icon: '💻' },
    { name: 'Fizika', count: '80+ instruktora', icon: '⚛️' },
    { name: 'Kemija', count: '70+ instruktora', icon: '🧪' },
    { name: 'Hrvatski jezik', count: '100+ instruktora', icon: '📚' },
  ]

  const stats = [
    { value: '500+', label: 'Instruktora' },
    { value: '10,000+', label: 'Uspješnih sesija' },
    { value: '4.9/5', label: 'Prosječna ocjena' },
    { value: '95%', label: 'Zadovoljnih korisnika' },
  ]

  const steps = [
    {
      number: '1',
      title: 'Pronađite instruktora',
      description: 'Pretražite našu bazu verificiranih instruktora po predmetu, cijeni i rasporedu',
    },
    {
      number: '2',
      title: 'Zakažite termin',
      description: 'Odaberite datum i vrijeme koje vam odgovara iz dostupnih termina',
    },
    {
      number: '3',
      title: 'Prijavite se na sesiju',
      description: 'Pridružite se video pozivu putem Zoom, Meet ili Teams platforme',
    },
    {
      number: '4',
      title: 'Učite i napredujte',
      description: 'Uživajte u kvalitetnoj nastavi i pratite svoj napredak',
    },
  ]

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative gradient-bg text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Najbolja platforma za online i uživo instrukcije
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
              Povežite se sa najboljim instruktorima u Hrvatskoj. Učite bilo gdje, bilo kada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link href="/tutors">
                <Button size="lg" variant="secondary">
                  <Search className="w-5 h-5 mr-2" />
                  Pronađi instruktora
                </Button>
              </Link>
              <Link href="/become-tutor">
                <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white">
                  <Award className="w-5 h-5 mr-2" />
                  Postani instruktor
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Zašto odabrati Instrukcije.hr?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Napredne funkcionalnosti koje čine učenje jednostavnim i efikasnim
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 gradient-bg rounded-2xl text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popularni predmeti
            </h2>
            <p className="text-xl text-gray-600">
              Pronađite instruktora za bilo koji predmet
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map((subject, index) => (
              <Link key={index} href={`/tutors?subject=${subject.name}`}>
                <Card hover className="text-center">
                  <div className="text-4xl mb-3">{subject.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.count}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kako funkcionira?
            </h2>
            <p className="text-xl text-gray-600">
              Jednostavan proces u 4 koraka
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center h-full">
                  <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-primary-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Spremni za početak?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Pridružite se tisućama zadovoljnih korisnika i počnite svoje putovanje učenja danas
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
