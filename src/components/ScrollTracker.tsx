'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackScrollDepth } from '@/lib/analytics'

/**
 * Scroll Depth Tracker
 * 
 * Tracks user scroll depth at key milestones:
 * - 25% (Quick scan)
 * - 50% (Half-read)
 * - 75% (Engaged reader)
 * - 90% (Almost complete)
 * 
 * These are important engagement signals for SEO.
 */
export function ScrollTracker() {
  const pathname = usePathname()
  const tracked = useRef<Set<number>>(new Set())

  useEffect(() => {
    // Reset tracked milestones on page change
    tracked.current.clear()

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      // Track milestones
      const milestones = [25, 50, 75, 90]
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !tracked.current.has(milestone)) {
          tracked.current.add(milestone)
          trackScrollDepth(milestone, pathname)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return null // This component doesn't render anything
}

