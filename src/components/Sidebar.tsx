import Link from 'next/link'
import { SidebarAd } from './AdUnit'
import NewsletterForm from './NewsletterForm'

interface Post {
  slug: string
  title: string
  category: string
  date: string
}

interface SidebarProps {
  trendingPosts?: Post[]
  highValuePosts?: Post[]
}

export default function Sidebar({ trendingPosts = [], highValuePosts = [] }: SidebarProps) {
  // Default posts if none provided
  const defaultTrending: Post[] = [
    { slug: 'walk-in-tubs-vs-curbless-showers', title: 'Walk-in Tubs vs. Curbless Showers', category: 'bathroom-safety', date: '2025-01-15' },
    { slug: 'radar-fall-detection', title: 'Radar-Based Fall Detection Systems', category: 'smart-monitoring', date: '2025-01-14' },
    { slug: 'stairlift-medicare-coverage', title: 'Does Medicare Cover Stairlifts?', category: 'finance-insurance', date: '2025-01-13' },
  ]

  const defaultHighValue: Post[] = [
    { slug: 'reverse-mortgage-home-improvements', title: 'Reverse Mortgage for Home Improvements', category: 'finance', date: '2025-01-12' },
    { slug: 'best-granny-pods', title: 'Best Granny Pods and ADUs', category: 'housing-options', date: '2025-01-11' },
    { slug: 'smart-home-alexa-guide', title: 'Smart Home Setup for Seniors', category: 'smart-home', date: '2025-01-10' },
  ]

  const trending = trendingPosts.length > 0 ? trendingPosts : defaultTrending
  const highValue = highValuePosts.length > 0 ? highValuePosts : defaultHighValue

  return (
    <aside className="w-full lg:w-80 space-y-8">
      {/* Ad Unit */}
      <SidebarAd />

      {/* Trending Retrofits */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          Trending Retrofits
        </h3>
        <ul className="space-y-4">
          {trending.map((post, index) => (
            <li key={post.slug}>
              <Link 
                href={`/${post.category}/${post.slug}`}
                className="group flex gap-3"
              >
                <span className="text-2xl font-bold text-slate-300 dark:text-slate-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-base text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* High Value Guides */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-primary-100 dark:border-primary-800">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          High Value Guides
        </h3>
        <ul className="space-y-3">
          {highValue.map((post) => (
            <li key={post.slug}>
              <Link 
                href={`/${post.category}/${post.slug}`}
                className="block p-3 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow group"
              >
                <span className="text-base text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors font-medium">
                  {post.title}
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500 block mt-1">
                  {post.category.replace('-', ' ')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter Signup */}
      <NewsletterForm variant="sidebar" />
    </aside>
  )
}
