'use client'

import { useEffect, useState } from 'react'

/**
 * Read Progress Bar
 * 
 * SEO Benefits:
 * - User engagement signal (dwell time)
 * - Visual feedback for long-form content
 * - Improves perceived page load performance
 */
export function ReadProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(scrollPercent, 100))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress() // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary-500 to-primary-600"
      style={{ 
        width: `${progress}%`,
        transition: 'width 150ms ease-out'
      }}
      aria-hidden="true"
    />
  )
}

