'use client'

import React, { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      category: 'Opće informacije',
      questions: [
        {
          question: 'Što je Instrukcije.hr?',
          answer:
            'Instrukcije.hr je moderna platforma koja povezuje učenike sa verificiranim instruktorima za online i uživo predavanja. Nudimo širok spektar predmeta za osnovnu školu, srednju školu, fakultet i ostale edukacije.',
        },
        {
          question: 'Kako funkcionira platforma?',
          answer:
            'Proces je jednostavan: pretražite instruktore po predmetu, odaberite termin iz dostupnih, platite sigurno putem Stripe platforme, i pridružite se video pozivu putem Zoom, Google Meet ili Microsoft Teams.',
        },
        {
          question: 'Je li korištenje platforme besplatno?',
          answer:
            'Registracija i pretraživanje instruktora je potpuno besplatno. Plaćate samo za rezervirane instrukcije.',
        },
      ],
    },
    {
      category: 'Za učenike',
      questions: [
        {
          question: 'Kako pronaći pravog instruktora?',
          answer:
            'Koristite napredne filtere za pretragu po predmetu, cijeni, ocjeni i dostupnosti. Pročitajte recenzije drugih učenika i pogledajte detaljne profile instruktora prije donošenja odluke.',
        },
        {
          question: 'Kako se odvijaju online instrukcije?',
          answer:
            'Online instrukcije se odvijaju putem video poziva na platformi po vašem izboru (Zoom, Google Meet ili Microsoft Teams). Link za poziv automatski dobivate nakon rezervacije.',
        },
        {
          question: 'Mogu li otkazati rezervaciju?',
          answer:
            'Da, rezervaciju možete otkazati besplatno do 24 sata prije zakazanog termina. Za otkazivanje manje od 24h prije termina, vraća se 50% iznosa.',
        },
        {
          question: 'Kako plaćam instrukcije?',
          answer:
            'Plaćanje se vrši sigurno putem Stripe platforme kreditnom ili debitnom karticom. Primite automatsku potvrdu i račun emailom.',
        },
        {
          question: 'Što ako nisam zadovoljan instrukcijom?',
          answer:
            'Nudimo garanciju povrata novca unutar 24 sata od prve instrukcije ako niste zadovoljni. Kontaktirajte našu podršku za detalje.',
        },
      ],
    },
    {
      category: 'Za instruktore',
      questions: [
        {
          question: 'Kako postati instruktor?',
          answer:
            'Registrirajte se, kreirajte detaljni profil sa svojim obrazovanjem i iskustvom, prođite verifikaciju, i počnite primati rezervacije.',
        },
        {
          question: 'Kolika je provizija platforme?',
          answer:
            'Provizija platforme je 15% od iznosa svake instrukcije. Primite 85% zarade.',
        },
        {
          question: 'Kada dobivam plaćanje?',
          answer:
            'Plaćanja se automatski prebacuju na vaš račun 24 sata nakon održane sesije. Isplate se vrše svakih 15 dana.',
        },
        {
          question: 'Mogu li sami postaviti cijenu?',
          answer:
            'Da, potpuno sami određujete svoju satnicu. Prosječna cijena instruktora je 25-40€/sat.',
        },
        {
          question: 'Trebam li certifikat?',
          answer:
            'Certifikat nije obavezan, ali je preporučljiv. Verificirani instruktori sa certifikatima imaju prednost u pretrazi i privlače više učenika.',
        },
      ],
    },
    {
      category: 'Tehnička pitanja',
      questions: [
        {
          question: 'Koje video platforme podržavate?',
          answer:
            'Podržavamo Zoom, Google Meet i Microsoft Teams. Možete odabrati platformu po svom izboru pri rezervaciji.',
        },
        {
          question: 'Što trebam za online instrukcije?',
          answer:
            'Potrebna vam je stabilna internet veza, webcam i mikrofon. Preporučujemo brzinu interneta minimalno 5 Mbps.',
        },
        {
          question: 'Funkcionira li platforma na mobitelu?',
          answer:
            'Da, platforma je potpuno responzivna i funkcionira izvrsno na svim uređajima - mobitel, tablet i desktop računala.',
        },
        {
          question: 'Kako znam da će video poziv raditi?',
          answer:
            'Automatski kreiramo link za video poziv i šaljemo vam ga emailom i u notifikacijama. Možete testirati vezu prije termina.',
        },
      ],
    },
    {
      category: 'Sigurnost i privatnost',
      questions: [
        {
          question: 'Je li moja platforma sigurna?',
          answer:
            'Da, sva plaćanja se obrađuju putem Stripe platforme koja ima najviše sigurnosne standarde. Ne pohranjujemo vaše podatke o kartici.',
        },
        {
          question: 'Kako štitite moje podatke?',
          answer:
            'Vaši podaci su zaštićeni prema GDPR standardima. Koristimo SSL enkripciju i najbolje sigurnosne prakse.',
        },
        {
          question: 'Jesu li instruktori provjereni?',
          answer:
            'Da, svi instruktori prolaze verifikaciju identiteta, obrazovanja i certifikata prije nego što mogu primati rezervacije.',
        },
      ],
    },
  ]

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Često postavljena pitanja
          </h1>
          <p className="text-xl text-gray-600">
            Pronađite odgovore na najčešća pitanja
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Pretražite pitanja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFaqs.length === 0 ? (
            <Card>
              <p className="text-center text-gray-600 py-8">
                Nema rezultata za vašu pretragu. Pokušajte s drugim pojmom.
              </p>
            </Card>
          ) : (
            filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex
                    const isOpen = openIndex === globalIndex

                    return (
                      <Card key={faqIndex} className="!p-0 overflow-hidden">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full text-left p-6 hover:bg-gray-50 transition-colors flex items-center justify-between"
                        >
                          <span className="font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <Card className="mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Niste pronašli odgovor?
          </h3>
          <p className="text-gray-600 mb-4">
            Naš tim je tu da vam pomogne. Kontaktirajte nas i odgovorit ćemo u roku od 24 sata.
          </p>
          <a href="/contact">
            <button className="btn-primary">Kontaktirajte nas</button>
          </a>
        </Card>
      </div>
    </div>
  )
}
