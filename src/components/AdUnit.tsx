'use client'

import { useEffect, useRef } from 'react'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'leaderboard' | 'rectangle' | 'skyscraper' | 'in-article'
  className?: string
}

// Ad slot configurations
const adConfigs = {
  'header-leaderboard': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 100 },
  },
  'sidebar-skyscraper': {
    desktop: { width: 300, height: 600 },
    mobile: null, // Not shown on mobile
  },
  'in-content-1': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
  },
  'in-content-2': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
  },
  'in-content-3': {
    desktop: { width: 336, height: 280 },
    mobile: { width: 300, height: 250 },
  },
  'footer-leaderboard': {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 100 },
  },
}

export default function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const isLoaded = useRef(false)

  useEffect(() => {
    if (isLoaded.current) return
    
    // Only load ads in production
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    try {
      // @ts-ignore
      if (window.adsbygoogle && adRef.current) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        isLoaded.current = true
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  const config = adConfigs[slot as keyof typeof adConfigs] || adConfigs['in-content-1']

  // Development placeholder
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div 
        className={`bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-sm ${className}`}
        style={{ 
          minHeight: config.desktop?.height || 90,
          maxWidth: config.desktop?.width || '100%',
        }}
      >
        <div className="text-center p-4">
          <p className="font-medium">Ad Placeholder</p>
          <p className="text-xs mt-1">{slot} ({config.desktop?.width}x{config.desktop?.height})</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Specialized ad components for common placements
export function InArticleAd({ position }: { position: 1 | 2 | 3 }) {
  return (
    <div className="my-8 flex justify-center">
      <AdUnit slot={`in-content-${position}`} format="in-article" />
    </div>
  )
}

export function SidebarAd() {
  return (
    <div className="hidden lg:block sticky top-24">
      <AdUnit slot="sidebar-skyscraper" format="rectangle" />
    </div>
  )
}

export function LeaderboardAd() {
  return (
    <div className="my-6 flex justify-center">
      <AdUnit slot="footer-leaderboard" format="leaderboard" />
    </div>
  )
}

