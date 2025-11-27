'use client'

import Link from 'next/link'
import { useState } from 'react'
import AdUnit from './AdUnit'

const categories = [
  { name: 'Bathroom Safety', slug: 'bathroom-safety' },
  { name: 'Smart Home', slug: 'smart-home' },
  { name: 'Finance & Insurance', slug: 'finance-insurance' },
  { name: 'Structural Retrofit', slug: 'structural-retrofit' },
  { name: 'Kitchen Safety', slug: 'kitchen-safety' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Top Ad Unit - Desktop 728x90 / Mobile 320x100 */}
      <div className="bg-slate-50 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <AdUnit slot="header-leaderboard" format="leaderboard" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-800">Retrofit<span className="text-primary-600">Age</span></span>
              <p className="text-xs text-slate-500 -mt-1">Aging-in-Place Solutions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="text-slate-600 hover:text-primary-600 font-medium transition-colors text-base"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/about"
              className="text-slate-600 hover:text-primary-600 font-medium transition-colors text-base"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200 animate-fade-in">
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="text-slate-600 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/about"
                className="text-slate-600 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

