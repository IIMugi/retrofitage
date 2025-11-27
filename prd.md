# Product Requirements Document (PRD): RetrofitAge.com
# Version: 1.0
# Niche: Aging-in-Place Technology & Home Retrofits
# Target Audience: Tier-1 Countries (USA, UK, CA, AU) - Adult Children of Seniors & Seniors.

## 1. Executive Summary
RetrofitAge.com is a high-performance, global niche website dedicated to "Aging-in-Place" technologies and home modifications. The goal is to provide authoritative, engineering-grade advice on retrofitting homes for seniors.
**Core Objective:** Maximize AdSense revenue via high CPC keywords (Insurance, Health, Finance) and organic traffic growth through high-quality, AI-generated content.

## 2. Technical Stack & Architecture
* **Framework:** Next.js 14 (App Router) - For speed and SEO.
* **Styling:** Tailwind CSS - Clean, accessible, responsive design.
* **Content Management:** Markdown/MDX files (stored locally in `content/posts`).
* **Automation:** Python script interacting with Google Gemini API.
* **Deployment:** Vercel or Netlify (Zero cost, high speed).
* **Analytics:** Google Analytics 4 (GA4) + Google Search Console verification ready.

## 3. UI/UX & Design Guidelines (Accessibility Focused)
* **Theme:** "Engineering Trust." Clean lines, white space, professional blue/grey color palette.
* **Typography:** Inter or Roboto. Base font size must be **18px** (larger than standard for readability).
* **Contrast:** High contrast text (#1a202c on #ffffff) to meet WCAG AAA standards.
* **Mobile First:** 70% of traffic is expected from mobile.
* **Speed:** Target PageSpeed Insights score of 95+.

## 4. SEO Requirements (The "Perfect SEO" Setup)
* **Meta Tags:** Automatic generation of Title, Description, and Canonical tags for every post.
* **Sitemap:** Automated `sitemap.xml` generation for all posts.
* **Robots.txt:** Standard allow configuration.
* **Schema Markup (Crucial):**
    * `Article` schema for blog posts.
    * `FAQPage` schema for the FAQ section of every post (Gemini will generate this).
    * `BreadcrumbList` schema for navigation.
* **URL Structure:** `https://retrofitage.com/category/slug`
* **Internal Linking:** Sidebar should feature "Trending Retrofits" and "High Value Guides".

## 5. AdSense & Monetization Strategy
* **Global Layout:**
    * **Header Ad:** 728x90 Leaderboard (Desktop) / 320x100 (Mobile) - "Above the fold".
    * **Sidebar Ad:** 300x600 Sticky Skyscraper (Desktop only).
    * **In-Content Ads:** Auto-injected dynamic ads after Paragraph 3, Paragraph 7, and before the Conclusion.
* **Affiliate Disclaimer:** Hardcoded visible disclaimer at the top of every post: *"As an Amazon Associate, we earn from qualifying purchases."*

## 6. Content Automation System (Python + Gemini API)
A Python script (`generate_content.py`) will be created to generate content in a loop.

### 6.1. The Content Loop Logic
1.  Read the list of 10 targeted topics (defined in Section 7).
2.  Iterate through each topic.
3.  Send a highly engineered prompt to Google Gemini 1.5 Pro (via Free API).
4.  Receive the output in Markdown format with Frontmatter.
5.  Save the file as `slug.mdx` in the content folder.
6.  Wait 20 seconds between requests to avoid API rate limits.

### 6.2. The "Deep Search" Prompt Structure
The script must use this specific system instruction for Gemini:

> "You are the Chief Engineer at RetrofitAge.com, a world-class expert in Aging-in-Place technology and home construction.
> Write a comprehensive, SEO-optimized blog post about: '{topic}'.
> **Tone:** Professional, empathetic, authoritative, and solution-oriented.
> **Format:** Markdown with Frontmatter (title, date, description, category).
> **Structure:**
> 1.  **engaging H1**
> 2.  **Executive Summary** (Bullet points of key takeaways).
> 3.  **The Problem** (Why this matters for senior safety).
> 4.  **Technical Solutions** (Deep dive, compare products/methods).
> 5.  **Cost Analysis** (Estimates in USD).
> 6.  **Installation Guide** (Step-by-step or when to hire a pro).
> 7.  **FAQ Section** (3-4 questions formatted for FAQ Schema).
> 8.  **Conclusion**.
> **Constraint:** Use American English. Ensure content is at least 1500 words. Do not use generic fluff. Focus on 'engineering' and 'safety'."

## 7. Initial Content Plan (The "Money" Articles)
The automation script will act on these 10 high-CPC/High-Intent titles:

1.  **Title:** "Walk-in Tubs vs. Curbless Showers: A Cost & Safety Analysis for 2025"
    * *Category:* Bathroom Safety
    * *Intent:* High Affiliate & AdSense.
2.  **Title:** "Radar-Based Fall Detection: Non-Wearable Monitoring Systems Reviewed"
    * *Category:* Smart Monitoring
    * *Intent:* Tech Product Sales.
3.  **Title:** "Does Medicare Cover Stairlifts? The Complete Financial Guide"
    * *Category:* Finance & Insurance
    * *Intent:* Very High CPC (Insurance Ads).
4.  **Title:** "Smart Home Setup for Seniors: The Ultimate Amazon Alexa Care Hub Guide"
    * *Category:* Smart Home
    * *Intent:* Amazon Affiliate Volume.
5.  **Title:** "How to Widen Doorways for Wheelchair Access: A Retrofit Guide"
    * *Category:* Structural Retrofit
    * *Intent:* High Contractor Ad Bids.
6.  **Title:** "Best Granny Pods and ADUs: Adding Senior Housing to Your Backyard"
    * *Category:* Housing Options
    * *Intent:* High Ticket Real Estate.
7.  **Title:** "Automatic Stove Turn-Off Devices: Preventing Kitchen Fires for Dementia Patients"
    * *Category:* Kitchen Safety
    * *Intent:* Specific Product Sales.
8.  **Title:** "Lighting Design for Aging Eyes: Lux Levels and LED Recommendations"
    * *Category:* Electrical & Lighting
    * *Intent:* Niche Technical Info.
9.  **Title:** "Reverse Mortgage for Home Improvements: Is It Worth It?"
    * *Category:* Finance
    * *Intent:* Highest CPC Potential.
10. **Title:** "DIY Grab Bar Installation: Tiles, Fiberglass, and Stud Finding Explained"
    * *Category:* Bathroom Safety
    * *Intent:* Informational / Trust Building.

## 8. Implementation Steps for AI Developer
1.  Initialize Next.js project with Tailwind.
2.  Create `components/AdUnit.tsx` for AdSense placement.
3.  Create `lib/gemini.py` script with the API key variable.
4.  Run the script to generate the 10 MDX files.
5.  Build the site pages to render MDX with proper typography.
6.  Generate Sitemap and RSS feed.