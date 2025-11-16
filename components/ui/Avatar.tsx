'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-2xl',
  }

  if (src) {
    return (
      <div className={cn('relative rounded-full overflow-hidden', sizes[size], className)}>
        <Image src={src} alt={name} fill className="object-cover" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
