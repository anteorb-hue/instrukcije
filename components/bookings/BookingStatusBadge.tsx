import React from 'react'
import Badge from '@/components/ui/Badge'
import {
  Calendar,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserX
} from 'lucide-react'

interface BookingStatusBadgeProps {
  status: string
  className?: string
}

export default function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'SCHEDULED':
        return {
          label: 'Zakazano',
          className: 'bg-blue-100 text-blue-800',
          icon: Calendar,
        }
      case 'IN_PROGRESS':
        return {
          label: 'U tijeku',
          className: 'bg-purple-100 text-purple-800',
          icon: Play,
        }
      case 'COMPLETED':
        return {
          label: 'Završeno',
          className: 'bg-green-100 text-green-800',
          icon: CheckCircle,
        }
      case 'CANCELLED':
        return {
          label: 'Otkazano',
          className: 'bg-gray-100 text-gray-800',
          icon: XCircle,
        }
      case 'NO_SHOW_TUTOR':
        return {
          label: 'No-Show Instruktor',
          className: 'bg-red-100 text-red-800',
          icon: UserX,
        }
      case 'NO_SHOW_STUDENT':
        return {
          label: 'No-Show Učenik',
          className: 'bg-red-100 text-red-800',
          icon: UserX,
        }
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800',
          icon: AlertTriangle,
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge className={`${config.className} ${className} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  )
}
