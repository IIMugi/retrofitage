# RetrofitAge.com - Teknik Context

## Teknoloji Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 3.x
- **Language:** TypeScript 5.x
- **Content:** MDX 2.x

### Backend/Scripts
- **Otomasyon:** Python 3.x
- **AI API:** Google Gemini 1.5 Pro (Free tier)

### Deployment
- **Platform:** Vercel veya Netlify
- **Maliyet:** Zero-cost hosting

### Analytics
- Google Analytics 4 (GA4)
- Google Search Console

## Önemli Paketler

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@next/mdx": "^14.x",
    "next-mdx-remote": "^4.x",
    "gray-matter": "^4.x",
    "tailwindcss": "^3.x"
  }
}
```

## Dosya Yapısı Kuralları

| Dizin | Amaç |
|-------|------|
| `src/app/` | Next.js App Router pages |
| `src/components/` | Reusable React components |
| `src/lib/` | Utility functions |
| `content/posts/` | MDX blog makaleleri |
| `scripts/` | Python automation scripts |
| `public/` | Static assets |

## Context7 Library ID'leri

| Paket | Context7 ID |
|-------|-------------|
| Next.js | `/vercel/next.js` |
| Tailwind CSS | `/tailwindcss/tailwindcss` |
| React | `/facebook/react` |
| MDX | `/mdx-js/mdx` |

## Önemli Konfigürasyonlar

### next.config.js
- MDX desteği aktif
- Image optimization
- Sitemap generation

### tailwind.config.js
- Custom color palette (blue/grey)
- 18px base font size
- Dark mode support (opsiyonel)

### TypeScript
- Strict mode aktif
- Path aliases (@/ prefix)

