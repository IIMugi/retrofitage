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
      // @ts-expect-error - AdSense global
      if (window.adsbygoogle && adRef.current) {
        // @ts-expect-error - AdSense global
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        isLoaded.current = true
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  const config = adConfigs[slot as keyof typeof adConfigs] || adConfigs['in-content-1']

  // Show placeholder when AdSense is not configured
  const isAdSenseConfigured = process.env.NEXT_PUBLIC_ADSENSE_ID && 
    process.env.NEXT_PUBLIC_ADSENSE_ID !== 'ca-pub-XXXXXXXXXX'
  
  if (!isAdSenseConfigured) {
    return (
      <div 
        className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm ${className}`}
        style={{ 
          minHeight: config.desktop?.height || 90,
          maxWidth: config.desktop?.width || '100%',
        }}
      >
        <div className="text-center p-4">
          <p className="font-medium">📢 Ad Space Reserved</p>
          <p className="text-xs mt-1">{slot} ({config.desktop?.width}x{config.desktop?.height})</p>
          <p className="text-xs mt-1 text-slate-300 dark:text-slate-600">AdSense pending approval</p>
        </div>
      </div>
    )
  }

  // Reserve space to prevent CLS
  const minHeight = config.mobile?.height || config.desktop?.height || 90

  return (
    <div 
      ref={adRef} 
      className={`ad-container ${className}`}
      style={{ minHeight: `${minHeight}px` }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: `${minHeight}px` }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Specialized ad components for common placements with CLS prevention
export function InArticleAd({ position }: { position: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div 
      className="my-8 flex justify-center" 
      style={{ minHeight: '280px' }}
      itemScope
      itemType="https://schema.org/WPAdBlock"
    >
      <div className="relative max-w-2xl w-full">
        <span className="absolute -top-4 left-0 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Advertisement
        </span>
        <AdUnit slot={`in-content-${position}`} format="in-article" />
      </div>
    </div>
  )
}

export function SidebarAd() {
  return (
    <div 
      className="hidden lg:block sticky top-24 self-start" 
      style={{ minHeight: '600px', height: 'fit-content' }}
      itemScope
      itemType="https://schema.org/WPAdBlock"
    >
      <AdUnit slot="sidebar-skyscraper" format="rectangle" />
    </div>
  )
}

export function LeaderboardAd() {
  return (
    <div className="my-6 flex justify-center" style={{ minHeight: '100px' }}>
      <AdUnit slot="footer-leaderboard" format="leaderboard" />
    </div>
  )
}

