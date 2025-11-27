# RetrofitAge.com - AI Geliştirici Talimatları

## 🎯 Proje Misyonu
Yaşlıların evlerinde güvenle yaşamasını sağlayan, yüksek kaliteli içerik ve mükemmel UX sunan bir Aging-in-Place website'i geliştirmek.

---

## ⚠️ KRİTİK KURALLAR (HER ZAMAN UYGULA)

### 1. Context7 ZORUNLU
```
Her kütüphane/framework kullanımında:
1. mcp_context7_resolve-library-id çağır
2. mcp_context7_get-library-docs ile doküman al
3. Güncel bilgiyle kod yaz

❌ Asla hafızadan framework kodu yazma
✅ Her zaman Context7'den güncel doküman çek
```

### 2. @Browser ile Test ZORUNLU
```
Her UI değişikliğinde:
1. browser_navigate ile sayfaya git
2. browser_snapshot ile elementleri al
3. browser_click/type ile etkileşim test et
4. browser_console_messages ile hata kontrol et

❌ "Çalışıyor olmalı" deme
✅ Browser'da test et, doğrula
```

### 3. Tek Session'da Her Şeyi Yap
```
Token yettiği sürece:
- Paralel tool çağrıları kullan
- Onay için bekleme, devam et
- Tüm görevleri tamamla
- Todo list ile takip et

❌ Her adımda durup sormak
✅ Planla → Geliştir → Test Et → Bitir
```

---

## 📋 Teknoloji Stack

| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| Next.js | 14 | App Router, SSR |
| Tailwind CSS | 3.x | Styling |
| TypeScript | 5.x | Type safety |
| MDX | 2.x | Content |
| Python | 3.x | Gemini automation |

---

## 🏗️ Proje Yapısı

```
RetrofitAge/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   └── [category]/
│   │       └── [slug]/
│   │           └── page.tsx # Blog post pages
│   ├── components/
│   │   ├── AdUnit.tsx       # AdSense placements
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── MDXContent.tsx
│   └── lib/
│       ├── mdx.ts           # MDX utilities
│       └── seo.ts           # SEO helpers
├── content/
│   └── posts/               # MDX blog articles
├── scripts/
│   └── generate_content.py  # Gemini automation
├── public/
└── .cursor/
    └── rules/               # Cursor AI rules
```

---

## 🎨 Tasarım Standartları

- **Font Size:** 18px minimum (erişilebilirlik)
- **Kontrast:** #1a202c on #ffffff (WCAG AAA)
- **Responsive:** Mobile-first (%70 mobil trafik)
- **PageSpeed:** 95+ hedef

---

## 📝 Kod Yazım Kuralları

```typescript
// ✅ Doğru: TypeScript, functional component
export const AdUnit = ({ slot, format }: AdUnitProps) => {
  return <div className="ad-container">...</div>
}

// ❌ Yanlış: any type, class component
export default class AdUnit extends React.Component<any> {...}
```

---

## 🔍 SEO Checklist

- [ ] Title tag (60 karakter max)
- [ ] Meta description (160 karakter max)
- [ ] Canonical URL
- [ ] Article Schema
- [ ] FAQPage Schema
- [ ] BreadcrumbList Schema
- [ ] Open Graph tags
- [ ] sitemap.xml
- [ ] robots.txt

---

## 💰 AdSense Yerleşimi

| Pozisyon | Desktop | Mobile |
|----------|---------|--------|
| Header | 728x90 | 320x100 |
| Sidebar | 300x600 (sticky) | - |
| In-content | Paragraf 3, 7, Sonuç öncesi | Aynı |

---

## 🚀 Geliştirme Workflow

```
1. PRD'yi oku ve anla
2. Context7 ile güncel doküman çek
3. Kod yaz
4. Browser ile test et
5. Lint kontrol et
6. Commit et
```

**Her adımda bu döngüyü takip et!**

