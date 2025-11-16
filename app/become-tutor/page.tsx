'use client'

import React from 'react'
import Link from 'next/link'
import { Check, TrendingUp, Calendar, Shield, DollarSign, Users, Video, Star } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function BecomeTutorPage() {
  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Konkurentna zarada',
      description: 'Sami određujete cijenu svojih usluga. Prosječni instruktor zarađuje 25-40€/sat',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Fleksibilno radno vrijeme',
      description: 'Podučavajte kada vam odgovara. Vi kontrolirate svoj raspored',
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Online ili uživo',
      description: 'Birajte između online predavanja ili osobnih susreta',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Sigurna plaćanja',
      description: 'Automatska obrada plaćanja putem Stripe platforme',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Pristup tisućama učenika',
      description: 'Povežite se sa učenicima iz cijele Hrvatske',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Izgradite reputaciju',
      description: 'Ocjene i recenzije pomažu vam privući više učenika',
    },
  ]

  const steps = [
    {
      number: 1,
      title: 'Registrirajte se',
      description: 'Napravite besplatan račun i odaberite "Postani instruktor"',
    },
    {
      number: 2,
      title: 'Kreirajte profil',
      description: 'Dodajte svoje obrazovanje, iskustvo i predmete koje podučavate',
    },
    {
      number: 3,
      title: 'Prođite verifikaciju',
      description: 'Verifikujemo vaše certifikate i obrazovanje',
    },
    {
      number: 4,
      title: 'Počnite podučavati',
      description: 'Prihvaćajte rezervacije i zarađujte',
    },
  ]

  const requirements = [
    'Stručno znanje u barem jednom predmetu',
    'Strpljenje i vještine komunikacije',
    'Pouzdana internet veza (za online nastavu)',
    'Webcam i mikrofon (za online nastavu)',
    'Spremnost na kontinuirani profesionalni razvoj',
  ]

  const faqs = [
    {
      question: 'Koliko košta registracija?',
      answer: 'Registracija je potpuno besplatna. Uzimamo samo 15% proviziju od svake rezervacije.',
    },
    {
      question: 'Trebam li imati certifikat?',
      answer: 'Certifikat nije obavezan, ali je preporučljiv. Verificirani instruktori imaju prednost u pretrazi.',
    },
    {
      question: 'Koliko mogu zaraditi?',
      answer: 'Prosječni instruktor zarađuje 25-40€/sat, ali vi određujete svoju cijenu. Neki instruktori zarađuju i preko 60€/sat.',
    },
    {
      question: 'Kada ću primiti plaćanje?',
      answer: 'Plaćanja se automatski prebacuju na vaš račun 24 sata nakon održane sesije.',
    },
    {
      question: 'Mogu li podučavati više predmeta?',
      answer: 'Da! Možete dodati koliko god predmeta želite u svoj profil.',
    },
  ]

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Postanite instruktor i zarađujte
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Podijelite svoje znanje, pomozite učenicima i ostvarite dodatnu zaradu
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Započni danas
                </Button>
              </Link>
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white">
                Saznaj više
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">25-40€</div>
              <div className="text-gray-600">Prosječna satnica</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">500+</div>
              <div className="text-gray-600">Aktivnih instruktora</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">10k+</div>
              <div className="text-gray-600">Održanih sesija</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">4.9/5</div>
              <div className="text-gray-600">Prosječna ocjena</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Zašto postati instruktor?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pridružite se zajednici stručnjaka i ostvarite svoje ciljeve
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} hover>
                <div className="inline-flex items-center justify-center w-16 h-16 gradient-bg rounded-2xl text-white mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kako započeti?
            </h2>
            <p className="text-xl text-gray-600">
              Jednostavan proces u 4 koraka
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center h-full">
                  <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
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

      {/* Requirements */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Što trebate?
              </h2>
              <p className="text-xl text-gray-600">
                Osnovni uvjeti za postajanje instruktora
              </p>
            </div>

            <Card>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 gradient-bg rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Često postavljena pitanja
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Spremni započeti svoju karijeru instruktora?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Registrirajte se besplatno i započnite sa radom u roku od 48 sati
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Postani instruktor sada
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
