'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-lg p-6 transition-all duration-200',
        hover && 'hover:shadow-xl cursor-pointer hover:-translate-y-1',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
