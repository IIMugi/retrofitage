'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

interface SearchResult {
  slug: string
  title: string
  description: string
  category: string
  date: string
}

// Static search data - will be populated from MDX files
const searchData: SearchResult[] = [
  {
    slug: 'walk-in-tubs-vs-curbless-showers',
    title: 'Walk-in Tubs vs. Curbless Showers: A Cost & Safety Analysis for 2025',
    description: 'Compare walk-in tubs and curbless showers for senior bathroom safety. Expert analysis of costs, installation, and which option is right for aging in place.',
    category: 'bathroom-safety',
    date: '2025-11-27',
  },
  // Add more posts here as they are created - or use API route
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    const timer = setTimeout(() => {
      const searchTerms = query.toLowerCase().split(' ')
      const filtered = searchData.filter(post => {
        const searchText = `${post.title} ${post.description} ${post.category}`.toLowerCase()
        return searchTerms.every(term => searchText.includes(term))
      })
      setResults(filtered)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Suggested searches
  const suggestions = useMemo(() => [
    'walk-in tubs',
    'bathroom safety',
    'stairlift',
    'medicare coverage',
    'fall detection',
    'grab bars',
    'smart home',
    'wheelchair ramp',
  ], [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-8 text-center">
        Search Our Guides
      </h1>

      {/* Search Input */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for bathroom safety, smart home, stairlifts..."
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
          autoFocus
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <svg className="animate-spin h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {!query && (
        <div className="mb-12">
          <h2 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-4">Popular searches:</h2>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {query && (
        <div>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {results.length === 0 
              ? 'No results found. Try different keywords.' 
              : `Found ${results.length} result${results.length === 1 ? '' : 's'}`}
          </p>
          
          <div className="space-y-6">
            {results.map((result) => (
              <Link
                key={result.slug}
                href={`/${result.category}/${result.slug}`}
                className="block group"
              >
                <article className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                  <span className="text-sm text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide">
                    {result.category.replace('-', ' ')}
                  </span>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mt-1 mb-2">
                    {result.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
                    {result.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-3">
                    <span>{result.date}</span>
                    <span className="text-primary-600 dark:text-primary-400">Read more →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!query && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Find What You Need
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Search our comprehensive guides on aging-in-place technology, home modifications, and senior safety solutions.
          </p>
        </div>
      )}
    </div>
  )
}

