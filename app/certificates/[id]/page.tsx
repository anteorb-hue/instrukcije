'use client'

import React, { useState, useRef } from 'react'
import {
  Award,
  Download,
  Share2,
  CheckCircle,
  Calendar,
  Users,
  BookOpen,
  ArrowLeft,
  Star,
  Copy,
  Check,
  Printer,
  Mail,
  Facebook,
  Linkedin,
  Twitter,
  X,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'

interface CertificateDetailProps {
  params: { id: string }
}

export default function CertificateDetailPage({ params }: CertificateDetailProps) {
  const router = useRouter()
  const certificateRef = useRef<HTMLDivElement>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  // Mock certificate data
  const certificate = {
    id: params.id,
    title: 'React.js - Napredni tečaj',
    description: 'Uspješno završen napredni tečaj React.js-a s ocjenom 95%',
    issueDate: new Date('2025-01-10'),
    courseOrLesson: 'React.js Napredni',
    tutor: {
      id: 'tutor-1',
      name: 'Marko Novak',
      credentials: 'Senior React Developer, 10+ godina iskustva',
    },
    student: {
      name: 'Ante Horvat',
      email: 'ante.horvat@example.com',
    },
    type: 'course' as const,
    verified: true,
    verificationCode: 'CERT-2025-REACT-001',
    completionDate: new Date('2025-01-10'),
    totalHours: 40,
    grade: 95,
    skills: [
      'React Hooks (useState, useEffect, useContext, useReducer)',
      'React Router & Navigation',
      'State Management (Redux, Context API)',
      'Performance Optimization',
      'Testing (Jest, React Testing Library)',
      'TypeScript s Reactom',
    ],
    issuer: 'Instrukcije.hr',
  }

  const handleDownload = () => {
    // In real app: generate PDF and download
    alert('Certifikat se preuzima kao PDF...')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Moj certifikat: ${certificate.title}`)
    const body = encodeURIComponent(
      `Pozdrav!\n\nŽelim podijeliti svoj certifikat s tobom:\n\n${certificate.title}\n\nPogledaj na: ${window.location.href}\n\nPozdrav,\n${certificate.student.name}`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const handleShareLinkedIn = () => {
    const url = window.location.href
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank'
    )
  }

  const handleShareFacebook = () => {
    const url = window.location.href
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank'
    )
  }

  const handleShareTwitter = () => {
    const url = window.location.href
    const text = `Upravo sam završio/la ${certificate.title} na @InstrukcijeHR! 🎓`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
        url
      )}`,
      '_blank'
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => router.push('/certificates')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Natrag na certifikate
        </button>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button variant="primary" icon={<Download className="w-5 h-5" />} onClick={handleDownload}>
            Preuzmi PDF
          </Button>
          <Button variant="outline" icon={<Printer className="w-5 h-5" />} onClick={handlePrint}>
            Ispiši
          </Button>
          <Button
            variant="outline"
            icon={<Share2 className="w-5 h-5" />}
            onClick={() => setShowShareModal(true)}
          >
            Podijeli
          </Button>
          <Button
            variant="outline"
            icon={linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            onClick={handleCopyLink}
          >
            {linkCopied ? 'Kopirano!' : 'Kopiraj link'}
          </Button>
        </div>

        {/* Certificate Card */}
        <Card className="mb-6 overflow-hidden" ref={certificateRef}>
          {/* Certificate Header */}
          <div className="relative gradient-bg text-white p-12 text-center">
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-white/30" />
            <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-white/30" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-white/30" />
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-white/30" />

            {/* Award Icon */}
            <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <Award className="w-16 h-16" />
            </div>

            {/* Title */}
            <h2 className="text-sm uppercase tracking-widest mb-2 opacity-90">
              Certifikat o završetku
            </h2>
            <h1 className="text-4xl font-bold mb-6">{certificate.title}</h1>

            {/* Verification Badge */}
            {certificate.verified && (
              <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Verificirani certifikat</span>
              </div>
            )}
          </div>

          {/* Certificate Body */}
          <div className="p-12">
            {/* Student Name */}
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-2">Ovo potvrđuje da je</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {certificate.student.name}
              </h2>
              <p className="text-gray-700 text-lg">uspješno završio/la</p>
            </div>

            {/* Course Details */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-primary-600 mb-2">
                  {certificate.courseOrLesson}
                </h3>
                <p className="text-gray-600">{certificate.description}</p>
              </div>

              {/* Skills Covered */}
              {certificate.skills && certificate.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 text-center">
                    Pokrivene vještine:
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {certificate.skills.map((skill, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Ukupno sati</p>
                  <p className="text-2xl font-bold text-primary-600">{certificate.totalHours}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Ocjena</p>
                  <div className="flex items-center justify-center">
                    <p className="text-2xl font-bold text-green-600">{certificate.grade}%</p>
                    <Star className="w-5 h-5 text-yellow-500 fill-current ml-2" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Datum završetka</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {certificate.completionDate.toLocaleDateString('hr-HR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Tutor & Issuer */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Instruktor</p>
                <p className="font-semibold text-gray-900">{certificate.tutor.name}</p>
                <p className="text-xs text-gray-600">{certificate.tutor.credentials}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Izdavač</p>
                <p className="font-semibold text-gray-900">{certificate.issuer}</p>
                <p className="text-xs text-gray-600">Online obrazovna platforma</p>
              </div>
            </div>

            {/* Verification Code */}
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Verifikacijski kod</p>
              <p className="font-mono text-sm font-semibold text-gray-900">
                {certificate.verificationCode}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Provjeri autentičnost na instrukcije.hr/verify
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Certificate Details */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Detalji certifikata</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <BookOpen className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Tečaj</p>
                  <p className="font-medium text-gray-900">{certificate.courseOrLesson}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Datum izdavanja</p>
                  <p className="font-medium text-gray-900">
                    {certificate.issueDate.toLocaleDateString('hr-HR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Instruktor</p>
                  <p className="font-medium text-gray-900">{certificate.tutor.name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant="success">Verificirano</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* How to use */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Kako koristiti certifikat</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-xs font-semibold">
                  1
                </div>
                <span>
                  <strong>Dodaj na LinkedIn:</strong> Klikni "Podijeli" i objavi na svom LinkedIn
                  profilu pod "Licenses & Certifications"
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-xs font-semibold">
                  2
                </div>
                <span>
                  <strong>Preuzmi PDF:</strong> Spremi certifikat i dodaj ga u svoj portfolio ili
                  CV prilog
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-xs font-semibold">
                  3
                </div>
                <span>
                  <strong>Podijeli s poslodavcem:</strong> Koristi verifikacijski kod za potvrdu
                  autentičnosti
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-xs font-semibold">
                  4
                </div>
                <span>
                  <strong>Ispiši i uokviri:</strong> Istakni svoje postignuće na radnom mjestu
                </span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Podijeli certifikat</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={<Linkedin className="w-5 h-5 text-blue-600" />}
                  onClick={handleShareLinkedIn}
                >
                  Podijeli na LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={<Facebook className="w-5 h-5 text-blue-500" />}
                  onClick={handleShareFacebook}
                >
                  Podijeli na Facebook
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={<Twitter className="w-5 h-5 text-blue-400" />}
                  onClick={handleShareTwitter}
                >
                  Podijeli na Twitter
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={<Mail className="w-5 h-5 text-gray-600" />}
                  onClick={handleShareEmail}
                >
                  Pošalji emailom
                </Button>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Ili kopiraj link</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={window.location.href}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      icon={linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      onClick={handleCopyLink}
                    >
                      {linkCopied ? 'Kopirano' : 'Kopiraj'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
