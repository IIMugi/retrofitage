# AdSense Implementation Guide - RetroFitAge

## 🎯 Current Status: READY FOR ADSENSE APPLICATION

### ✅ Completed Requirements

#### 1. Content Quality
- [x] 10 unique, high-quality articles (aging-in-place niche)
- [x] 2000+ words per article (engineering-grade advice)
- [x] Original Python-generated content (Google Gemini API)
- [x] Regular updates (automated content pipeline ready)

#### 2. Site Structure
- [x] About page (authority & expertise)
- [x] Contact page (functional form)
- [x] Privacy Policy (GDPR compliant)
- [x] Terms of Service
- [x] Disclosure page (affiliate transparency)

#### 3. Technical Requirements
- [x] Custom domain (retrofitage.com)
- [x] HTTPS enabled (Vercel SSL)
- [x] Mobile-responsive design (accessibility-focused)
- [x] Fast loading (PageSpeed 95+ target)
- [x] Clean navigation & site structure

#### 4. Traffic & Engagement
- [x] Google Search Console ready
- [x] Sitemap.xml automated
- [x] Google Analytics 4 ready
- [x] Social sharing capability
- [x] Internal linking structure

#### 5. Ad Placements (CLS-Safe & Schema-Ready)
- [x] Header leaderboard ad (728x90 desktop, 320x100 mobile)
- [x] Sidebar sticky ad (300x600, desktop only)
- [x] Dynamic in-article ads (2-5 based on content length)
- [x] End-of-content ad (high-value position)
- [x] Footer leaderboard ad
- [x] All with WPAdBlock schema markup

---

## 🚀 How to Activate AdSense (After Approval)

### Step 1: Get AdSense Credentials

1. Apply at: https://www.google.com/adsense
2. Wait for approval (typically 1-2 weeks)
3. Copy your **AdSense Publisher ID** (ca-pub-XXXXXXXXXXXXXXXX)
4. Create ad units in AdSense dashboard and note slot IDs

### Step 2: Configure Environment Variables

Create/update `.env.local`:

```bash
# AdSense Configuration
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX

# Google Analytics (Optional)
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

### Step 3: Update Ad Slot IDs

Replace placeholder slot IDs in `src/components/AdUnit.tsx`:

```typescript
const adConfigs = {
  'header-leaderboard': { ... },      // Replace with actual slot ID
  'sidebar-skyscraper': { ... },      // Replace with actual slot ID
  'in-content-1': { ... },            // Replace with actual slot ID
  'in-content-2': { ... },            // Replace with actual slot ID
  'in-content-3': { ... },            // Replace with actual slot ID
  'end-of-content': { ... },          // New high-value slot
  'footer-leaderboard': { ... },      // Replace with actual slot ID
}
```

### Step 4: Deploy to Production

```bash
# Set environment variable on Vercel
vercel env add NEXT_PUBLIC_ADSENSE_ID

# Redeploy
git push origin main
```

### Step 5: Verify Ad Display

1. Visit your live site in incognito mode
2. Check console for AdSense errors
3. Verify CLS (Cumulative Layout Shift) remains low
4. Test on mobile and desktop
5. Monitor AdSense dashboard for impressions

---

## 💰 Revenue Optimization Strategy

### High-Value Ad Positions (Priority Order)

1. **End-of-Content Ad** (280px) - Users finished reading, highest engagement
2. **Sticky Sidebar** (600px, desktop) - Persistent visibility, high viewability
3. **Dynamic In-Article Ads** (2-5 based on length) - Natural content breaks
4. **Header Leaderboard** (90-100px) - Initial impression, brand awareness
5. **Footer Leaderboard** (90px) - Exit intent

### Content Strategy for Higher CPM

RetroFitAge targets **high-CPC keywords** in the aging-in-place niche:

- **Insurance**: Long-term care, home insurance, Medicare
- **Finance**: Reverse mortgages, home equity loans, retirement planning
- **Health**: Medical equipment, accessibility devices, safety technology
- **Real Estate**: Home modifications, ADUs (Granny Pods), property retrofits

**Target Audience Geography** (Tier-1):
- USA (primary - highest CPM)
- UK, Canada, Australia (secondary)

**Expected AdSense RPM**: $15-35 (due to high-CPC niche)

### Technical Optimizations (Already Implemented)

✅ All ads are CLS-safe (fixed minHeight prevents layout shift)
✅ Lazy loading for below-fold ads
✅ Conditional rendering (only loads if AdSense configured)
✅ Schema markup (WPAdBlock) for better crawlability
✅ Responsive ad units (mobile/desktop optimization)

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

- **RPM (Revenue Per 1000 impressions)**: Target $15-35 (aging-in-place niche)
- **CTR (Click-Through Rate)**: Target 1.5-3%
- **Page Views**: Track via GA4
- **Ad Viewability**: Monitor in AdSense dashboard (target 70%+)
- **CLS Score**: Keep below 0.1 (Google Core Web Vitals)

### Analytics Events (Implemented)

All events automatically tracked when GA4 configured:

- `scroll_depth_25/50/75/90` - Engagement signal (dwell time)
- `cta_click` - Conversion tracking (newsletter, contact)
- `click_outbound_link` - Affiliate link tracking
- `newsletter_signup` - Lead generation

---

## 🛡️ Policy Compliance

### AdSense Program Policies (Verified)

- [x] No prohibited content (medical advice is educational only)
- [x] No copyright violations (all content is original/generated)
- [x] No deceptive practices (clear "Advertisement" labels)
- [x] No invalid clicks incentives
- [x] Privacy policy mentions ads/cookies
- [x] Disclosure page for affiliate relationships

### Google Publisher Policies

- [x] Ads clearly labeled ("Advertisement")
- [x] Sufficient unique content per page (2000+ words)
- [x] No excessive ads (follows Better Ads Standards)
- [x] Mobile-friendly (responsive design, 18px base font)
- [x] Accessibility-focused (WCAG AAA contrast, large fonts)

---

## 🔧 Troubleshooting

### Ads Not Showing?

1. Check `.env.local` has correct `NEXT_PUBLIC_ADSENSE_ID`
2. Verify slot IDs in `src/components/AdUnit.tsx`
3. Check browser console for AdSense errors
4. Wait 24-48 hours after first setup (AdSense cache)
5. Ensure production environment (ads don't show in `NODE_ENV=development`)

### Low Revenue?

1. **Increase Traffic**: Focus on high-CPC keywords (reverse mortgage, stairlift costs, etc.)
2. **Optimize Ad Positions**: Test with AdSense experiments
3. **Create High-CPC Content**: Tool reviews, cost guides, insurance comparisons
4. **Target High-Paying Geographies**: USA, UK, Canada, Australia
5. **Improve Dwell Time**: Add related content, internal links, TOC

### CLS Issues?

- All ad units already have `minHeight` prop (CLS prevention)
- Check with PageSpeed Insights (target CLS < 0.1)
- Adjust minHeight if needed for your actual ad sizes
- Ensure images have width/height attributes

---

## 📈 Growth Roadmap

### Phase 1: Content Foundation (Complete)
- ✅ 10 high-quality articles
- ✅ Core pages (About, Contact, Legal)
- ✅ Technical SEO setup

### Phase 2: Traffic Generation (Next 30 Days)
- [ ] Target 50+ articles (use Python automation script)
- [ ] Google Search Console optimization
- [ ] Social media presence (Pinterest for DIY retrofits)
- [ ] Backlink outreach (aging-in-place blogs, AARP, etc.)

### Phase 3: Monetization Optimization (After AdSense Approval)
- [ ] A/B test ad placements
- [ ] Add affiliate links (Amazon, Home Depot, specialized equipment)
- [ ] Create downloadable guides (lead magnets)
- [ ] Consider premium content (paid courses/webinars)

### Phase 4: Scale (3-6 Months)
- [ ] Target 100+ articles
- [ ] Build email list (10,000+ subscribers)
- [ ] Partner with brands (Kohler, Grab Bar manufacturers)
- [ ] Video content (YouTube channel for DIY guides)

---

## 📞 Support & Resources

### Official Documentation
- AdSense Help Center: https://support.google.com/adsense
- Next.js Image Optimization: https://nextjs.org/docs/optimization/images
- Google Publisher Policies: https://support.google.com/adsense/answer/9335564

### Internal Tools
- Content Generation Script: `scripts/generate_content.py`
- Topics List: `scripts/topics.json`
- Content History: `scripts/content-history.json`

---

**Last Updated:** 2025-12-09  
**Status:** Ready for AdSense application (content milestone: 10+ posts ✓)  
**Expected Approval Time:** 1-2 weeks  
**Projected Monthly Revenue (at 10K page views)**: $150-350

