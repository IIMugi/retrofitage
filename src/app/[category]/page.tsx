import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPostsByCategory, getAllCategories } from '@/lib/mdx'
import Sidebar from '@/components/Sidebar'

// Category metadata
const categoryInfo: Record<string, { title: string; description: string; icon: string }> = {
  'bathroom-safety': {
    title: 'Bathroom Safety',
    description: 'Walk-in tubs, grab bars, non-slip surfaces, and shower modifications for senior safety.',
    icon: '🚿',
  },
  'smart-home': {
    title: 'Smart Home',
    description: 'Voice assistants, monitoring systems, and automation technology for aging in place.',
    icon: '🏠',
  },
  'smart-monitoring': {
    title: 'Smart Monitoring',
    description: 'Fall detection systems, health monitors, and emergency alert devices for seniors.',
    icon: '📡',
  },
  'finance-insurance': {
    title: 'Finance & Insurance',
    description: 'Medicare coverage, insurance options, and financial planning for home modifications.',
    icon: '💰',
  },
  'finance': {
    title: 'Finance',
    description: 'Reverse mortgages, loans, and financial assistance for aging-in-place renovations.',
    icon: '💵',
  },
  'structural-retrofit': {
    title: 'Structural Retrofit',
    description: 'Ramps, doorway widening, stairlifts, and major home accessibility modifications.',
    icon: '🔧',
  },
  'housing-options': {
    title: 'Housing Options',
    description: 'ADUs, granny pods, and alternative housing solutions for multigenerational living.',
    icon: '🏡',
  },
  'kitchen-safety': {
    title: 'Kitchen Safety',
    description: 'Stove safety, ergonomic design, and fire prevention for senior kitchens.',
    icon: '👨‍🍳',
  },
  'electrical-lighting': {
    title: 'Electrical & Lighting',
    description: 'Proper lighting design, electrical safety, and visibility solutions for aging eyes.',
    icon: '💡',
  },
  'accessibility': {
    title: 'Accessibility',
    description: 'General accessibility modifications and ADA compliance for home safety.',
    icon: '♿',
  },
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({ category }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const info = categoryInfo[category]
  
  if (!info) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `${info.title} - Aging in Place Guides | RetrofitAge`,
    description: info.description,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const info = categoryInfo[category]
  
  if (!info) {
    notFound()
  }

  const posts = await getPostsByCategory(category)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{info.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{info.title}</h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mt-2">{info.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/${post.category}/${post.slug}`}
                    className="block group"
                  >
                    <article className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all flex flex-col md:flex-row">
                      {/* Thumbnail - Fixed dimensions to prevent CLS */}
                      {post.image ? (
                        <div className="md:w-72 h-48 md:h-auto flex-shrink-0 relative overflow-hidden" style={{ minHeight: '192px' }}>
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 288px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="md:w-72 h-48 md:h-auto flex-shrink-0 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900 dark:to-blue-900 flex items-center justify-center" style={{ minHeight: '192px' }}>
                          <span className="text-5xl">{info.icon}</span>
                        </div>
                      )}
                      {/* Content */}
                      <div className="p-6 flex-1">
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                          {post.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readingTime}</span>
                          <span>•</span>
                          <span className="text-primary-600 dark:text-primary-400">Read more →</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-12 text-center">
                <span className="text-6xl mb-4 block">{info.icon}</span>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Coming Soon!
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  We are working on comprehensive guides for {info.title.toLowerCase()}. 
                  Check back soon or subscribe to be notified when new content is published.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse All Guides
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
