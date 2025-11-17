'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import { AlertTriangle, X } from 'lucide-react'

interface NoShowButtonProps {
  bookingId: string
  currentStatus: string
  userRole: 'TUTOR' | 'STUDENT'
  onSuccess?: () => void
}

export default function NoShowButton({
  bookingId,
  currentStatus,
  userRole,
  onSuccess,
}: NoShowButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  // Only allow reporting no-show for scheduled or in-progress sessions
  if (!['SCHEDULED', 'IN_PROGRESS'].includes(currentStatus)) {
    return null
  }

  const handleReportNoShow = async () => {
    try {
      setLoading(true)

      // Determine the no-show status based on who is reporting
      // If tutor reports, it means student didn't show up
      // If student reports, it means tutor didn't show up
      const noShowStatus = userRole === 'TUTOR' ? 'NO_SHOW_STUDENT' : 'NO_SHOW_TUTOR'

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: noShowStatus }),
      })

      if (response.ok) {
        alert('No-show prijavljen. Penalty će biti primijenjen na korisnika koji se nije pojavio.')
        setShowConfirm(false)
        if (onSuccess) onSuccess()
      } else {
        const error = await response.json()
        alert(error.error || 'Greška pri prijavljivanju no-show')
      }
    } catch (error) {
      console.error('Error reporting no-show:', error)
      alert('Greška pri prijavljivanju no-show')
    } finally {
      setLoading(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Prijavi No-Show
              </h3>
              <p className="text-sm text-gray-600">
                {userRole === 'TUTOR'
                  ? 'Jeste li sigurni da učenik nije došao na instrukciju? Učenik će dobiti -50 bodova penala.'
                  : 'Jeste li sigurni da instruktor nije došao na instrukciju? Instruktor će dobiti -50 bodova penala.'}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ Ova akcija je ozbiljna i ne može se poništiti. Koristite samo ako se druga strana stvarno nije pojavila.
              </p>
            </div>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowConfirm(false)}
              disabled={loading}
            >
              Odustani
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleReportNoShow}
              loading={loading}
            >
              Prijavi No-Show
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      <AlertTriangle className="w-4 h-4" />
      <span>Prijavi No-Show</span>
    </button>
  )
}
