'use client'

import { useState } from 'react'

interface NewsletterFormProps {
  variant?: 'sidebar' | 'footer' | 'inline'
}

export default function NewsletterForm({ variant = 'sidebar' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Please enter your email')
      return
    }

    setStatus('loading')

    try {
      // Using Formspree - free form backend
      const response = await fetch('https://formspree.io/f/xrbwkwnq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          _subject: 'New Newsletter Subscription - RetrofitAge',
        }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Thanks for subscribing! Check your inbox.')
        setEmail('')
      } else {
        throw new Error('Failed to subscribe')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-slate-800 dark:bg-slate-950 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
        <p className="text-slate-300 text-sm mb-4">
          Get the latest aging-in-place tips and product reviews delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? '✓ Subscribed!' : 'Subscribe Free'}
          </button>
        </form>
        {message && (
          <p className={`text-sm mt-3 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    )
  }

  // Inline variant for homepage/footer
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        disabled={status === 'loading' || status === 'success'}
        className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed whitespace-nowrap"
      >
        {status === 'loading' ? 'Subscribing...' : status === 'success' ? '✓ Subscribed!' : 'Subscribe'}
      </button>
      {message && (
        <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}

