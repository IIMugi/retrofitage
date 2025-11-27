import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/mdx'
import { 
  generateSEO, 
  generateArticleSchema, 
  generateBreadcrumbSchema,
  generateFAQSchema 
} from '@/lib/seo'
import Sidebar from '@/components/Sidebar'
import { InArticleAd, LeaderboardAd } from '@/components/AdUnit'
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

  const relatedPosts = await getRelatedPosts(slug, category)

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

  return (
    <>
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

      {/* Affiliate Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-sm text-amber-800">
            <strong>Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. 
            <Link href="/disclosure" className="underline ml-1">Learn more</Link>
          </p>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li>
              <Link href="/" className="hover:text-primary-600">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${category}`} className="hover:text-primary-600 capitalize">
                {category.replace('-', ' ')}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-700 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 max-w-content">
            {/* Header */}
            <header className="mb-8">
              <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide mb-4">
                {category.replace('-', ' ')}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-xl text-slate-600 mb-6">
                {post.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 border-b border-slate-200 pb-6">
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
            <div className="prose prose-lg prose-slate max-w-none">
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

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-500 mb-3">Related Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/${relatedPost.category}/${relatedPost.slug}`}
                      className="group"
                    >
                      <article className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                        <h4 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                          {relatedPost.description}
                        </p>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* In-article Ad 3 - Before conclusion */}
            <InArticleAd position={3} />
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </article>

      {/* Footer Ad */}
      <LeaderboardAd />
    </>
  )
}

