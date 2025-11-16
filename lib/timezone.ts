// Timezone utilities for booking system

export interface Timezone {
  value: string
  label: string
  offset: string
}

// Common European timezones
export const TIMEZONES: Timezone[] = [
  { value: 'Europe/Zagreb', label: 'Zagreb (CET/CEST)', offset: '+01:00' },
  { value: 'Europe/Belgrade', label: 'Belgrade (CET/CEST)', offset: '+01:00' },
  { value: 'Europe/Sarajevo', label: 'Sarajevo (CET/CEST)', offset: '+01:00' },
  { value: 'Europe/Ljubljana', label: 'Ljubljana (CET/CEST)', offset: '+01:00' },
  { value: 'Europe/Vienna', label: 'Vienna (CET/CEST)', offset: '+01:00' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: '+01:00' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: '+01:00' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)', offset: '+01:00' },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: '+00:00' },
  { value: 'Europe/Dublin', label: 'Dublin (GMT/IST)', offset: '+00:00' },
  { value: 'Europe/Lisbon', label: 'Lisbon (WET/WEST)', offset: '+00:00' },
  { value: 'Europe/Athens', label: 'Athens (EET/EEST)', offset: '+02:00' },
  { value: 'Europe/Helsinki', label: 'Helsinki (EET/EEST)', offset: '+02:00' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)', offset: '+03:00' },
  { value: 'America/New_York', label: 'New York (EST/EDT)', offset: '-05:00' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: '-06:00' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: '-08:00' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: '+04:00' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: '+08:00' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+09:00' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: '+10:00' },
]

// Detect user's timezone
export function detectUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

// Convert date to specific timezone
export function convertToTimezone(date: Date, timezone: string): Date {
  const dateString = date.toLocaleString('en-US', { timeZone: timezone })
  return new Date(dateString)
}

// Format date in specific timezone
export function formatInTimezone(
  date: Date,
  timezone: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  return new Intl.DateTimeFormat('hr-HR', {
    ...options,
    timeZone: timezone,
  }).format(date)
}

// Get timezone offset
export function getTimezoneOffset(timezone: string): string {
  const now = new Date()
  const formatted = now.toLocaleString('en-US', {
    timeZone: timezone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const local = new Date(formatted)
  const utc = new Date(now.toISOString())
  const diff = (local.getTime() - utc.getTime()) / (1000 * 60)

  const hours = Math.floor(Math.abs(diff) / 60)
  const minutes = Math.abs(diff) % 60
  const sign = diff >= 0 ? '+' : '-'

  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

// Check if timezones are the same
export function isSameTimezone(tz1: string, tz2: string): boolean {
  return getTimezoneOffset(tz1) === getTimezoneOffset(tz2)
}

// Convert booking time between timezones
export function convertBookingTime(
  date: Date,
  fromTimezone: string,
  toTimezone: string
): Date {
  // Convert to UTC first
  const utcTime = new Date(
    date.toLocaleString('en-US', { timeZone: fromTimezone })
  )

  // Then convert to target timezone
  return convertToTimezone(utcTime, toTimezone)
}

// Get available time slots for a day in specific timezone
export function getAvailableSlots(
  date: Date,
  timezone: string,
  startHour: number = 8,
  endHour: number = 20,
  slotDuration: number = 60
): Date[] {
  const slots: Date[] = []
  const day = new Date(date)

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const slot = new Date(day)
      slot.setHours(hour, minute, 0, 0)
      slots.push(slot)
    }
  }

  return slots
}

// Format time range with timezone
export function formatTimeRange(
  start: Date,
  end: Date,
  timezone: string
): string {
  const startStr = formatInTimezone(start, timezone, {
    hour: '2-digit',
    minute: '2-digit',
  })

  const endStr = formatInTimezone(end, timezone, {
    hour: '2-digit',
    minute: '2-digit',
  })

  const tzAbbr = TIMEZONES.find(tz => tz.value === timezone)?.offset || ''

  return `${startStr} - ${endStr} (${tzAbbr})`
}

// Check if time is in business hours for timezone
export function isBusinessHours(
  date: Date,
  timezone: string,
  startHour: number = 8,
  endHour: number = 20
): boolean {
  const hour = parseInt(
    formatInTimezone(date, timezone, { hour: '2-digit', hour12: false })
  )

  return hour >= startHour && hour < endHour
}

// Get user's preferred timezone from localStorage
export function getUserTimezone(): string {
  if (typeof window === 'undefined') return 'Europe/Zagreb'

  const stored = localStorage.getItem('userTimezone')
  return stored || detectUserTimezone()
}

// Save user's preferred timezone
export function setUserTimezone(timezone: string) {
  localStorage.setItem('userTimezone', timezone)
}
