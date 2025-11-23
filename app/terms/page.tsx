'use client'

import React from 'react'
import Card from '@/components/ui/Card'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Uvjeti korištenja</h1>

        <Card className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-sm mb-6">
            Zadnje ažurirano: 16. siječnja 2025.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Prihvaćanje uvjeta</h2>
            <p className="text-gray-700 leading-relaxed">
              Korištenjem platforme Instrukcije.hr pristajete na ove Uvjete korištenja. Ako se ne
              slažete s bilo kojim dijelom ovih uvjeta, ne smijete koristiti našu uslugu.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Opis usluge</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Instrukcije.hr je platforma koja povezuje učenike sa instruktorima za online i uživo
              predavanja. Nudimo:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Pretraživanje i rezervaciju instruktora</li>
              <li>Video pozive putem Zoom, Google Meet i Microsoft Teams</li>
              <li>Sigurno plaćanje putem Stripe platforme</li>
              <li>Messaging sistem između učenika i instruktora</li>
              <li>Review i rating sistem</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Registracija korisnika</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Za korištenje usluge morate kreirati račun. Obvezujete se da ćete:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Pružiti točne, aktualne i potpune informacije</li>
              <li>Održavati sigurnost svog računa</li>
              <li>Odmah nas obavijestiti o neovlaštenom pristupu</li>
              <li>Biti odgovorni za sve aktivnosti na vašem računu</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Pravila ponašanja</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Korisnici se obvezuju da neće:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Kršiti zakone ili prava drugih korisnika</li>
              <li>Zloupotrebljavati platformu ili njene usluge</li>
              <li>Prenositi viruse ili zlonamjerni kod</li>
              <li>Uznemiravati, vrijeđati ili prijetiti drugim korisnicima</li>
              <li>Koristiti platformu u komercijalne svrhe bez dozvole</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Plaćanja i povrati</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sva plaćanja se obrađuju putem Stripe platforme. Uvjeti plaćanja:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Cijene određuju instruktori samostalno</li>
              <li>Platforma uzima 15% proviziju od svake transakcije</li>
              <li>Besplatno otkazivanje do 24h prije termina</li>
              <li>Povrat 50% za otkazivanje manje od 24h prije termina</li>
              <li>Garancija povrata novca za prvu instrukciju ako niste zadovoljni</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Za instruktore
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Instruktori se obvezuju:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Pružiti točne informacije o obrazovanju i iskustvu</li>
              <li>Održavati profesionalne standarde</li>
              <li>Poštovati zakazane termine</li>
              <li>Prihvatiti 15% proviziju platforme</li>
              <li>Proći verifikaciju identiteta i kvalifikacija</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Intelektualno vlasništvo
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Svi sadržaji na platformi, uključujući dizajn, logotipe, tekstove i kod, zaštićeni
              su autorskim pravima i pripadaju Instrukcije.hr osim ako nije drugačije naznačeno.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Ograničenje odgovornosti
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Instrukcije.hr nije odgovoran za kvalitetu instrukcija ili ponašanje korisnika. Ne
              garantujemo određene rezultate učenja. Platforma se pruža &quot;kakva jest&quot; bez ikakvih
              garancija.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Prekid usluge</h2>
            <p className="text-gray-700 leading-relaxed">
              Zadržavamo pravo da suspendiramo ili prekinemo vaš pristup usluzi u bilo kojem
              trenutku zbog kršenja ovih Uvjeta ili iz drugih razumnih razloga.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Izmjene uvjeta</h2>
            <p className="text-gray-700 leading-relaxed">
              Zadržavamo pravo izmjene ovih Uvjeta u bilo kojem trenutku. O značajnim izmjenama
              ćemo vas obavijestiti emailom. Nastavkom korištenja usluge nakon izmjena prihvaćate
              nove uvjete.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Primjenjivo pravo</h2>
            <p className="text-gray-700 leading-relaxed">
              Ovi Uvjeti regulirani su zakonima Republike Hrvatske. Svi sporovi rješavat će se
              pred nadležnim sudovima u Zagrebu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Kontakt</h2>
            <p className="text-gray-700 leading-relaxed">
              Za pitanja o ovim Uvjetima, kontaktirajte nas na:
              <br />
              Email: info@instrukcije.hr
              <br />
              Telefon: +385 1 234 5678
              <br />
              Adresa: Ilica 242, 10000 Zagreb, Hrvatska
            </p>
          </section>
        </Card>
      </div>
    </div>
  )
}
