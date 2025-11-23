'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {} from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState([
    { id: '1', dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
    { id: '2', dayOfWeek: 1, startTime: '14:00', endTime: '18:00' },
    { id: '3', dayOfWeek: 2, startTime: '09:00', endTime: '12:00' },
    { id: '4', dayOfWeek: 2, startTime: '14:00', endTime: '18:00' },
    { id: '5', dayOfWeek: 4, startTime: '09:00', endTime: '12:00' },
    { id: '6', dayOfWeek: 4, startTime: '14:00', endTime: '18:00' },
  ])

  const addTimeSlot = (dayOfWeek: number) => {
    setAvailability([
      ...availability,
      {
        id: Date.now().toString(),
        dayOfWeek,
        startTime: '09:00',
        endTime: '17:00'
},
    ])
  }

  const removeTimeSlot = (id: string) => {
    setAvailability(availability.filter((slot) => slot.id !== id))
  }

  const updateTimeSlot = (id: string, field: string, value: string) => {
    setAvailability(
      availability.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    )
  }

  const handleSave = async () => {
    try {
      // API call to save availability
      toast.success('Dostupnost uspješno ažurirana!')
    } catch {
      toast.error('Greška pri ažuriranju dostupnosti')
    }
  }

  const daysOfWeek = [
    { value: 1, label: 'Ponedjeljak' },
    { value: 2, label: 'Utorak' },
    { value: 3, label: 'Srijeda' },
    { value: 4, label: 'Četvrtak' },
    { value: 5, label: 'Petak' },
    { value: 6, label: 'Subota' },
    { value: 0, label: 'Nedjelja' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Uredi dostupnost</h1>
          <p className="text-gray-600">
            Postavite svoje dostupne termine kada učenici mogu zakazati instrukcije
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            {daysOfWeek.map((day) => {
              const daySlots = availability.filter((slot) => slot.dayOfWeek === day.value)

              return (
                <div key={day.value} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{day.label}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTimeSlot(day.value)}
                      icon={<Plus className="w-4 h-4" />}
                    >
                      Dodaj termin
                    </Button>
                  </div>

                  {daySlots.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Nemate dostupnih termina</p>
                  ) : (
                    <div className="space-y-3">
                      {daySlots.map((slot) => (
                        <div key={slot.id} className="flex items-center space-x-4">
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Od
                              </label>
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  updateTimeSlot(slot.id, 'startTime', e.target.value)
                                }
                                className="input-field"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Do
                              </label>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  updateTimeSlot(slot.id, 'endTime', e.target.value)
                                }
                                className="input-field"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeTimeSlot(slot.id)}
                            className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-end space-x-4">
            <Button variant="outline">Otkaži</Button>
            <Button variant="primary" icon={<Save className="w-5 h-5" />} onClick={handleSave}>
              Spremi promjene
            </Button>
          </div>
        </Card>

        {/* Tips */}
        <Card className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Savjeti</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Postavite realna vremena kada ste sigurno dostupni</li>
            <li>• Učenici mogu zakazati samo u vašim dostupnim terminima</li>
            <li>• Možete imati više vremenskih blokova istog dana</li>
            <li>• Redovno ažurirajte dostupnost kako biste privukli više učenika</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
