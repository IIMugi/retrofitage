import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/mdx'
import Sidebar from '@/components/Sidebar'
import { LeaderboardAd } from '@/components/AdUnit'

// Featured categories with icons
const categories = [
  {
    name: 'Bathroom Safety',
    slug: 'bathroom-safety',
    description: 'Walk-in tubs, grab bars, non-slip solutions',
    icon: '🚿',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
  {
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Voice assistants, monitoring systems, automation',
    icon: '🏠',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  {
    name: 'Finance & Insurance',
    slug: 'finance-insurance',
    description: 'Medicare coverage, reverse mortgages, grants',
    icon: '💰',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  },
  {
    name: 'Structural Retrofit',
    slug: 'structural-retrofit',
    description: 'Ramps, doorway widening, stairlifts',
    icon: '🔧',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  },
]

export default async function HomePage() {
  const posts = await getAllPosts()
  const latestPosts = posts.slice(0, 6)
  const featuredPost = posts[0]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white leading-tight mb-6">
              Make Your Home <span className="text-primary-600 dark:text-primary-400">Safe</span> for 
              <span className="text-primary-600 dark:text-primary-400"> Independent Living</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Expert guides on aging-in-place technology, home modifications, and safety solutions. 
              Trusted advice from engineers and healthcare professionals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/bathroom-safety"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors text-lg"
              >
                Explore Safety Guides
              </Link>
              <Link
                href="/about"
                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 transition-colors text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
            <strong>Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. 
            <Link href="/disclosure" className="underline ml-1">Learn more</Link>
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 ${cat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-base">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Unit - Fixed height container to prevent CLS */}
      <div style={{ minHeight: '112px', contain: 'layout' }}>
        <LeaderboardAd />
      </div>

      {/* Latest Articles + Sidebar */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">
                Latest Guides
              </h2>

              {/* Featured Article */}
              {featuredPost && (
                <Link
                  href={`/${featuredPost.category}/${featuredPost.slug}`}
                  className="block mb-8 group"
                >
                  <article className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-slate-200 dark:bg-slate-700 relative" style={{ minHeight: '200px' }}>
                      {featuredPost.image ? (
                        <Image
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900 dark:to-blue-900">
                          🏠
                        </div>
                      )}
                      <span className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="p-6">
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide">
                        {featuredPost.category?.replace('-', ' ')}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mt-3 text-lg line-clamp-2">
                        {featuredPost.description}
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-300">
                        <span>{featuredPost.date}</span>
                        <span>•</span>
                        <span>{featuredPost.readingTime || '5 min read'}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Article Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestPosts.slice(1).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/${post.category}/${post.slug}`}
                    className="group"
                  >
                    <article className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                      <div className="aspect-[16/9] bg-slate-100 dark:bg-slate-700 relative" style={{ minHeight: '150px' }}>
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            className="object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                            📋
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide">
                          {post.category?.replace('-', ' ')}
                        </span>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-300 mt-2 text-sm line-clamp-2">
                          {post.description}
                        </p>
                        <span className="text-xs text-slate-400 dark:text-slate-400 mt-3 block">
                          {post.date}
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* View All Link */}
              <div className="mt-8 text-center">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-lg"
                >
                  View All Articles
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            Trusted by Families Nationwide
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12">
            Our engineering-grade advice helps thousands of families make informed decisions 
            about home safety modifications.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Monthly Readers' },
              { number: '200+', label: 'Expert Guides' },
              { number: '95%', label: 'Reader Satisfaction' },
              { number: '24/7', label: 'Free Resources' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">{stat.number}</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
