import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'All Articles - RetrofitAge',
  description: 'Browse all our expert guides on aging-in-place solutions, home safety modifications, and senior living technology.',
}

export default async function ArticlesPage() {
  const posts = await getAllPosts()

  // Group posts by category
  const categories = posts.reduce((acc, post) => {
    const cat = post.category || 'uncategorized'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(post)
    return acc
  }, {} as Record<string, typeof posts>)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            All Articles
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
            Expert guides on aging-in-place solutions, home modifications, and safety technology. 
            Find the information you need to make your home safe and accessible.
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-4">
            {posts.length} articles available
          </p>
        </div>
      </div>

      {/* All Articles */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Recent Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">
            Recent Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.category}/${post.slug}`}
                className="group"
              >
                <article className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700 h-full flex flex-col">
                  <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-700 relative">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                        📋
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide">
                      {post.category?.replace(/-/g, ' ')}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 dark:text-slate-500">
                      <span>{post.date}</span>
                      {post.readingTime && (
                        <>
                          <span>•</span>
                          <span>{post.readingTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* By Category */}
        {Object.keys(categories).length > 1 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">
              Browse by Category
            </h2>
            <div className="space-y-12">
              {Object.entries(categories).map(([category, categoryPosts]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 capitalize">
                      {category.replace(/-/g, ' ')}
                    </h3>
                    <Link
                      href={`/${category}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPosts.slice(0, 3).map((post) => (
                      <Link
                        key={post.slug}
                        href={`/${post.category}/${post.slug}`}
                        className="group p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <h4 className="font-medium text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {post.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No articles found. Check back soon for new content!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

