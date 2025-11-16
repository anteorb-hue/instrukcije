'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Search, Bell, User, LogOut, BookOpen, MessageSquare, Calendar } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import NotificationCenter from '@/components/notifications/NotificationCenter'

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Instrukcije.hr</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tutors" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Pronađi instruktora
            </Link>
            <Link href="/group-lessons" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Grupne lekcije
            </Link>
            <Link href="/forum" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Forum
            </Link>
            <Link href="/become-tutor" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Postani instruktor
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Kako funkcionira
            </Link>
          </div>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/messages">
                  <Button variant="ghost" size="sm" icon={<MessageSquare className="w-5 h-5" />}>
                    Poruke
                  </Button>
                </Link>
                <Link href="/bookings">
                  <Button variant="ghost" size="sm" icon={<Calendar className="w-5 h-5" />}>
                    Termini
                  </Button>
                </Link>
                <NotificationCenter />
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Avatar src={session.user.avatar} name={session.user.name || ''} size="sm" />
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Moj profil</span>
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Odjavi se</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Prijavi se
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Registriraj se
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/tutors" className="text-gray-700 hover:text-primary-600 font-medium">
                Pronađi instruktora
              </Link>
              <Link href="/group-lessons" className="text-gray-700 hover:text-primary-600 font-medium">
                Grupne lekcije
              </Link>
              <Link href="/forum" className="text-gray-700 hover:text-primary-600 font-medium">
                Forum
              </Link>
              <Link href="/become-tutor" className="text-gray-700 hover:text-primary-600 font-medium">
                Postani instruktor
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-primary-600 font-medium">
                Kako funkcionira
              </Link>
              {session ? (
                <>
                  <Link href="/messages" className="text-gray-700 hover:text-primary-600 font-medium">
                    Poruke
                  </Link>
                  <Link href="/bookings" className="text-gray-700 hover:text-primary-600 font-medium">
                    Termini
                  </Link>
                  <Link href="/notifications" className="text-gray-700 hover:text-primary-600 font-medium">
                    Notifikacije
                  </Link>
                  <Link href="/profile" className="text-gray-700 hover:text-primary-600 font-medium">
                    Moj profil
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-red-600 font-medium"
                  >
                    Odjavi se
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full">
                      Prijavi se
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" className="w-full">
                      Registriraj se
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
