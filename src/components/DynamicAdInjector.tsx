'use client'

import { InArticleAd } from './AdUnit'

interface DynamicAdInjectorProps {
  contentLength: number  // Character count
  wordCount?: number     // Optional word count
}

/**
 * Dynamic Ad Injection based on content length
 * 
 * Strategy (AdSense Best Practices for aging-in-place niche):
 * - Short content (<1500 words): 2 ads
 * - Medium content (1500-3000 words): 3 ads
 * - Long content (3000+ words): 4-5 ads
 * 
 * CLS-safe: All ads have fixed minHeight (280px)
 */
export function DynamicAdInjector({ contentLength, wordCount }: DynamicAdInjectorProps) {
  // Estimate word count if not provided (avg 5 chars/word)
  const estimatedWords = wordCount || Math.floor(contentLength / 5)
  
  let adCount = 2 // Default minimum
  
  if (estimatedWords >= 3500) {
    adCount = 5 // Very long guides (e.g., complete home retrofit guides)
  } else if (estimatedWords >= 3000) {
    adCount = 4
  } else if (estimatedWords >= 2000) {
    adCount = 3
  } else if (estimatedWords >= 1500) {
    adCount = 3
  }

  // Never exceed 5 ads to maintain user experience
  adCount = Math.min(adCount, 5)

  return (
    <>
      {Array.from({ length: adCount }, (_, i) => (
        <InArticleAd key={`dynamic-ad-${i + 1}`} position={(i + 1) as 1 | 2 | 3} />
      ))}
    </>
  )
}

