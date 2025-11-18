import { useRef, useEffect, useState } from 'react'

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number // Minimum distance for swipe
}

export default function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeGestureOptions) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const handleTouchStart = (e: TouchEvent | React.TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e.changedTouches[0]
    setTouchEnd(null)
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setIsSwiping(true)
  }

  const handleTouchMove = (e: TouchEvent | React.TouchEvent) => {
    if (!touchStart) return

    const touch = 'touches' in e ? e.touches[0] : e.changedTouches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })

    // Calculate offset for visual feedback
    const offset = touch.clientX - touchStart.x
    setSwipeOffset(offset)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsSwiping(false)
      setSwipeOffset(0)
      return
    }

    const distanceX = touchEnd.x - touchStart.x
    const distanceY = touchEnd.y - touchStart.y

    // Check if horizontal swipe (not vertical scroll)
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)

    if (isHorizontalSwipe) {
      if (distanceX > threshold && onSwipeRight) {
        onSwipeRight()
      } else if (distanceX < -threshold && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    // Reset
    setTouchStart(null)
    setTouchEnd(null)
    setIsSwiping(false)
    setSwipeOffset(0)
  }

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isSwiping,
    swipeOffset,
  }
}
