import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import Image from 'next/image'
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/mdx'
import { 
  generateSEO, 
  generateArticleSchema, 
  generateBreadcrumbSchema,
  generateFAQSchema 
} from '@/lib/seo'
import Sidebar from '@/components/Sidebar'
import { InArticleAd, LeaderboardAd } from '@/components/AdUnit'
import { EndOfContentAd } from '@/components/EndOfContentAd'
import { ReadProgressBar } from '@/components/ReadProgressBar'
import { ScrollTracker } from '@/components/ScrollTracker'
import { mdxComponents } from '@/lib/mdx-components'
import remarkGfm from 'remark-gfm'

interface PageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map(({ category, slug }) => ({
    category,
    slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Article Not Found',
    }
  }

  return generateSEO({
    title: post.title,
    description: post.description,
    canonical: `/${category}/${slug}`,
    image: post.image,
    type: 'article',
    publishedTime: post.date,
    author: post.author,
    tags: post.tags,
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { category, slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(slug, category, post.tags || [])

  // Generate schemas
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description,
    url: `https://retrofitage.com/${category}/${slug}`,
    image: post.image,
    datePublished: post.date,
    author: post.author,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()), url: `/${category}` },
    { name: post.title, url: `/${category}/${slug}` },
  ])

  // Extract FAQs from content if present (simple regex approach)
  const faqMatches = post.content.match(/## FAQ[\s\S]*?(?=##|$)/i)
  let faqSchema = null
  if (faqMatches) {
    const faqContent = faqMatches[0]
    const questions = faqContent.match(/### (.+?)[\s\S]*?(?=###|$)/g)
    if (questions && questions.length > 0) {
      const faqs = questions.map(q => {
        const lines = q.split('\n').filter(l => l.trim())
        return {
          question: lines[0].replace('### ', ''),
          answer: lines.slice(1).join(' ').trim()
        }
      }).filter(f => f.question && f.answer)
      
      if (faqs.length > 0) {
        faqSchema = generateFAQSchema(faqs)
      }
    }
  }

  // Calculate word count for dynamic ads
  const wordCount = post.content.split(/\s+/).length
  const shouldShowDynamicAds = wordCount > 1000 // Only for substantial content

  // Check if content is a guide/tutorial for HowTo schema
  const isGuide = post.title.toLowerCase().includes('guide') || 
                  post.title.toLowerCase().includes('how to') ||
                  post.category === 'guides'

  // Generate HowTo schema for guide content
  let howToSchema = null
  if (isGuide) {
    // Extract steps from content (h2 or h3 headings)
    const stepMatches = post.content.match(/###? (.+)/g)
    if (stepMatches && stepMatches.length >= 3) {
      const steps = stepMatches.slice(0, 10).map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.replace(/###? /, '').trim(),
        url: `https://retrofitage.com/${category}/${slug}#step-${index + 1}`,
      }))

      howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: post.title,
        description: post.description,
        step: steps,
      }
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Read Progress Bar */}
      <ReadProgressBar />
      
      {/* Scroll Depth Tracker */}
      <ScrollTracker />

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* Affiliate Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. 
            <Link href="/disclosure" className="underline ml-1">Learn more</Link>
          </p>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${category}`} className="hover:text-primary-600 dark:hover:text-primary-400 capitalize">
                {category.replace('-', ' ')}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 max-w-content">
            {/* Featured Image - Fixed dimensions to prevent CLS */}
            {post.image && (
              <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg" style={{ minHeight: '256px' }}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}

            {/* Header */}
            <header className="mb-8">
              <span className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide mb-4">
                {category.replace('-', ' ')}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
                {post.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-6">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {post.readingTime}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </span>
              </div>
            </header>

            {/* In-article Ad 1 */}
            <InArticleAd position={1} />

            {/* MDX Content */}
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <MDXRemote 
                source={post.content} 
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                  }
                }}
              />
            </div>

            {/* In-article Ad 2 */}
            <InArticleAd position={2} />

            {/* Dynamic Additional Ads (based on content length) */}
            {shouldShowDynamicAds && wordCount > 2000 && <InArticleAd position={3} />}
            {shouldShowDynamicAds && wordCount > 3000 && <InArticleAd position={4} />}

            {/* End of Content Ad (High-value position) */}
            <EndOfContentAd />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Related Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                  Continue Reading: Related Retrofit Guides
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/${relatedPost.category}/${relatedPost.slug}`}
                      className="group block"
                    >
                      <article className="bg-slate-50 dark:bg-slate-800 rounded-lg p-5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:shadow-lg h-full">
                        {relatedPost.image && (
                          <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <h4 className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                          {relatedPost.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 mt-3 font-medium">
                          Read more →
                        </span>
                      </article>
                    </Link>
                  ))}
                </div>
                
                {/* CTA to All Articles */}
                <div className="mt-6 text-center">
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors"
                  >
                    View All Aging-in-Place Guides
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </article>

      {/* Footer Ad */}
      <LeaderboardAd />
    </div>
  )
}
