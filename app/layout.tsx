import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/providers/AuthProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Instrukcije.hr - Najbolja platforma za online i uživo instrukcije',
  description: 'Pronađite najboljeg instruktora za osnovnu školu, srednju školu, fakultet i ostale edukacije. Video pozivi putem Zoom, Google Meet i Microsoft Teams.',
  keywords: 'instrukcije, online nastava, instruktor, privatni časovi, škola, edukacija, Hrvatska',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hr">
      <body className={inter.className}>
        <AuthProvider>
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ErrorBoundary>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
