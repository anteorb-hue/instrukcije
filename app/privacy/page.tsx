'use client'

import React from 'react'
import Card from '@/components/ui/Card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Politika privatnosti</h1>

        <Card className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-sm mb-6">
            Zadnje ažurirano: 16. siječnja 2025.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Uvod</h2>
            <p className="text-gray-700 leading-relaxed">
              Instrukcije.hr ("mi", "naš") posvećeni smo zaštiti vaše privatnosti. Ova Politika
              privatnosti objašnjava kako prikupljamo, koristimo, dijelimo i štitimo vaše osobne
              podatke u skladu sa GDPR (General Data Protection Regulation) i hrvatskim zakonima o
              zaštiti podataka.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Podaci koje prikupljamo
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Prikupljamo sljedeće vrste podataka:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Osnovni podaci</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Ime i prezime</li>
              <li>Email adresa</li>
              <li>Telefonski broj (opcionalno)</li>
              <li>Adresa (za uživo instrukcije)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Profil korisnika</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Profilna fotografija</li>
              <li>Biografija</li>
              <li>Obrazovanje i certifikati (za instruktore)</li>
              <li>Predmeti i razine podučavanja</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Podaci o korištenju</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>IP adresa</li>
              <li>Tip browsera i uređaja</li>
              <li>Vrijeme i trajanje posjeta</li>
              <li>Klikovi i navigacija po stranici</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Financijski podaci</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Podaci o plaćanju (procesuira Stripe, ne pohranjujemo ih)</li>
              <li>Povijest transakcija</li>
              <li>Podaci o isplatama (za instruktore)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Kako koristimo vaše podatke
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vaše podatke koristimo za:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Pružanje i unapređenje naših usluga</li>
              <li>Procesiranje rezervacija i plaćanja</li>
              <li>Komunikaciju sa vama (podrška, notifikacije)</li>
              <li>Personalizaciju vašeg iskustva</li>
              <li>Sprječavanje prijevara i zloupotreba</li>
              <li>Poštovanje zakonskih obveza</li>
              <li>Analitiku i poboljšanje platforme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Dijeljenje podataka s trećim stranama
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dijelimo vaše podatke samo u sljedećim slučajevima:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Pružatelji usluga</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Stripe - procesiranje plaćanja</li>
              <li>Zoom, Google, Microsoft - video pozivi</li>
              <li>Email servisi - slanje notifikacija</li>
              <li>Hosting provider - pohranjivanje podataka</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Zakonske obveze</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Možemo otkriti vaše podatke ako to zahtijeva zakon ili sudski nalog.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 S vašom dozvolom</h3>
            <p className="text-gray-700 leading-relaxed">
              Dijelimo podatke s drugim korisnicima samo uz vaš pristanak (npr. profil
              instruktora je javan).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Kolačići (Cookies)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Koristimo kolačiće za:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Održavanje prijave korisnika</li>
              <li>Praćenje preferenci</li>
              <li>Analitiku i poboljšanje usluge</li>
              <li>Personalizaciju sadržaja</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Možete kontrolirati kolačiće kroz postavke vašeg browsera.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sigurnost podataka</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Koristimo industrijske sigurnosne standarde:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>SSL/TLS enkripcija za prijenos podataka</li>
              <li>Bcrypt za hashiranje lozinki</li>
              <li>Redovne sigurnosne provjere</li>
              <li>Ograničen pristup podacima</li>
              <li>Backup i disaster recovery planovi</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Vaša prava (GDPR)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Prema GDPR-u, imate sljedeća prava:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Pravo na pristup podacima</li>
              <li>Pravo na ispravak podataka</li>
              <li>Pravo na brisanje podataka ("pravo na zaborav")</li>
              <li>Pravo na ograničenje obrade</li>
              <li>Pravo na prenosivost podataka</li>
              <li>Pravo na prigovor</li>
              <li>Pravo na povlačenje pristanka</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Za ostvarivanje prava, kontaktirajte nas na privacy@instrukcije.hr
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Zadržavanje podataka
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Vaše podatke čuvamo koliko je potrebno za pružanje usluge i ispunjenje zakonskih
              obveza. Nakon brisanja računa, vaše podatke trajno brišemo unutar 30 dana, osim ako
              zakon ne zahtijeva duže čuvanje.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Djeca</h2>
            <p className="text-gray-700 leading-relaxed">
              Naša usluga nije namijenjena djeci mlađoj od 16 godina. Ne prikupljamo svjesno
              podatke od djece. Ako saznamo da smo prikupili podatke od djeteta, odmah ih brišemo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Izmjene politike
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Zadržavamo pravo izmjene ove Politike privatnosti. O značajnim izmjenama ćemo vas
              obavijestiti emailom i na platformi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Kontakt</h2>
            <p className="text-gray-700 leading-relaxed">
              Za pitanja o zaštiti podataka kontaktirajte:
              <br />
              <br />
              Email: privacy@instrukcije.hr
              <br />
              Službenik za zaštitu podataka: dpo@instrukcije.hr
              <br />
              Adresa: Ilica 242, 10000 Zagreb, Hrvatska
              <br />
              <br />
              Također imate pravo podnijeti pritužbu Agenciji za zaštitu osobnih podataka (AZOP):
              <br />
              www.azop.hr
            </p>
          </section>
        </Card>
      </div>
    </div>
  )
}
