'use client'

import AdUnit from './AdUnit'

/**
 * End-of-Content Ad (High-Value Position)
 * 
 * Positioned after article content but before related posts.
 * Users have finished reading = high engagement opportunity.
 * 
 * CLS Prevention: Fixed minHeight (280px)
 * Schema: WPAdBlock for better SEO
 */
export function EndOfContentAd() {
  return (
    <div 
      className="my-12 border-t border-slate-200 dark:border-slate-700 pt-8"
      itemScope
      itemType="https://schema.org/WPAdBlock"
    >
      <div className="relative">
        <span className="absolute -top-5 left-0 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Advertisement
        </span>
        <div className="flex justify-center">
          <AdUnit 
            slot="end-of-content" 
            format="auto"
            className="max-w-2xl w-full"
          />
        </div>
      </div>
    </div>
  )
}

