'use client'

import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface BookingCalendarProps {
  availability: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
  bookedSlots: Array<{
    date: Date
    startTime: string
    endTime: string
  }>
  onSelectSlot: (date: Date, time: string) => void
}

export default function BookingCalendar({
  availability,
  bookedSlots,
  onSelectSlot,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay()
    return availability.some((slot) => slot.dayOfWeek === dayOfWeek)
  }

  const getAvailableTimesForDate = (date: Date) => {
    const dayOfWeek = date.getDay()
    const dayAvailability = availability.filter((slot) => slot.dayOfWeek === dayOfWeek)

    const times: string[] = []
    dayAvailability.forEach((slot) => {
      const start = parseInt(slot.startTime.split(':')[0])
      const end = parseInt(slot.endTime.split(':')[0])

      for (let hour = start; hour < end; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`)
      }
    })

    return times
  }

  const isTimeBooked = (date: Date, time: string) => {
    return bookedSlots.some((slot) => {
      const slotDate = new Date(slot.date)
      return (
        slotDate.toDateString() === date.toDateString() &&
        slot.startTime === time
      )
    })
  }

  const handleDateChange = (value: any) => {
    setSelectedDate(value)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (selectedDate) {
      onSelectSlot(selectedDate, time)
    }
  }

  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || !isDateAvailable(date)
  }

  const tileClassName = ({ date }: { date: Date }) => {
    if (!isDateAvailable(date)) return 'unavailable'
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      return 'selected'
    }
    return ''
  }

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : []

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="calendar-wrapper">
        <style jsx global>{`
          .react-calendar {
            width: 100%;
            border: none;
            border-radius: 12px;
            padding: 20px;
            background: white;
            font-family: inherit;
          }

          .react-calendar__navigation {
            display: flex;
            margin-bottom: 20px;
          }

          .react-calendar__navigation button {
            min-width: 44px;
            background: none;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
          }

          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #f3f4f6;
            border-radius: 8px;
          }

          .react-calendar__month-view__weekdays {
            text-align: center;
            font-weight: 600;
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
          }

          .react-calendar__month-view__weekdays__weekday {
            padding: 8px;
          }

          .react-calendar__tile {
            padding: 12px 6px;
            background: none;
            text-align: center;
            line-height: 16px;
            font-size: 14px;
            border-radius: 8px;
          }

          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #f3f4f6;
          }

          .react-calendar__tile--now {
            background: #dbeafe;
            font-weight: 600;
          }

          .react-calendar__tile--active,
          .react-calendar__tile.selected {
            background: linear-gradient(to bottom right, #0ea5e9, #d946ef);
            color: white;
            font-weight: 600;
          }

          .react-calendar__tile:disabled {
            background-color: transparent;
            color: #d1d5db;
          }

          .react-calendar__month-view__days__day--neighboringMonth {
            color: #d1d5db;
          }
        `}</style>

        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileDisabled={tileDisabled}
          tileClassName={tileClassName}
          minDate={new Date()}
          locale="hr-HR"
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Dostupni termini za {selectedDate.toLocaleDateString('hr-HR')}
          </h3>

          {availableTimes.length === 0 ? (
            <p className="text-gray-600">Nema dostupnih termina za ovaj dan</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {availableTimes.map((time) => {
                const isBooked = isTimeBooked(selectedDate, time)
                const isSelected = selectedTime === time

                return (
                  <button
                    key={time}
                    onClick={() => !isBooked && handleTimeSelect(time)}
                    disabled={isBooked}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-all
                      ${
                        isBooked
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:bg-primary-50'
                      }
                    `}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-200 rounded"></div>
          <span className="text-gray-600">Danas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-primary-600 to-secondary-600 rounded"></div>
          <span className="text-gray-600">Odabrano</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-gray-600">Nedostupno</span>
        </div>
      </div>
    </div>
  )
}
