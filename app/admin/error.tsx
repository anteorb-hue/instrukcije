'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin Dashboard Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Došlo je do greške
        </h2>
        <p className="text-gray-600 mb-6">
          Nažalost, nismo uspjeli učitati admin dashboard. Molimo pokušajte ponovno.
        </p>
        {error.message && (
          <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-100 p-3 rounded">
            {error.message}
          </p>
        )}
        <Button onClick={reset} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Pokušaj ponovno
        </Button>
      </Card>
    </div>
  )
}
