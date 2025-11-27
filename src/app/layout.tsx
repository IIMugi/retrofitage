import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://retrofitage.com'),
  title: {
    default: "RetrofitAge - Aging-in-Place Solutions & Home Safety Guides",
    template: "%s | RetrofitAge"
  },
  description: "Expert guides on aging-in-place technology, home modifications, and senior safety solutions. Make your home safer for independent living.",
  keywords: ["aging in place", "senior home safety", "home modifications", "elderly care", "stairlifts", "walk-in tubs", "grab bars", "fall prevention"],
  authors: [{ name: "RetrofitAge" }],
  creator: "RetrofitAge",
  publisher: "RetrofitAge",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://retrofitage.com',
    siteName: 'RetrofitAge',
    title: 'RetrofitAge - Aging-in-Place Solutions & Home Safety',
    description: 'Expert guides on aging-in-place technology and home modifications for senior safety.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RetrofitAge - Home Safety for Seniors',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RetrofitAge - Aging-in-Place Solutions',
    description: 'Expert guides on home modifications for senior safety.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '3-1_FDHOHIKmYLNqTZtoVkk2ugbxSzEDgXE_k9CDZrw',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Prevent FOUC for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
        {/* AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
          crossOrigin="anonymous"
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 antialiased min-h-screen flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <GoogleAnalytics />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
