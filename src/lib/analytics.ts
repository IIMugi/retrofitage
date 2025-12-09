/**
 * Analytics Event Tracking
 * 
 * Google Analytics 4 (GA4) Event Helper
 * Safe to use even without GA4 configured
 */

interface EventParams {
  action: string
  category: string
  label?: string
  value?: number
}

/**
 * Track custom event to GA4
 * No-op if GA4 not configured
 */
export function trackEvent({ action, category, label, value }: EventParams) {
  if (typeof window === 'undefined') return

  try {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  } catch (error) {
    // Silently fail - analytics should never break UX
    console.debug('[Analytics] Event tracking failed:', error)
  }
}

/**
 * Track scroll depth milestones (25%, 50%, 75%, 90%)
 * Automatically called by ScrollTracker component
 */
export function trackScrollDepth(percentage: number, pathname: string) {
  trackEvent({
    action: `scroll_depth_${percentage}`,
    category: 'engagement',
    label: pathname,
    value: percentage,
  })
}

/**
 * Track outbound link clicks
 */
export function trackOutboundLink(url: string, label?: string) {
  trackEvent({
    action: 'click_outbound_link',
    category: 'navigation',
    label: label || url,
  })
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(location: string) {
  trackEvent({
    action: 'newsletter_signup',
    category: 'conversion',
    label: location,
  })
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(ctaLabel: string, location: string) {
  trackEvent({
    action: 'cta_click',
    category: 'engagement',
    label: `${ctaLabel} (${location})`,
  })
}

