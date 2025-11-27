import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  category: string
  image?: string
  author?: string
  readingTime?: string
  tags?: string[]
  featured?: boolean
}

export interface Post extends PostMeta {
  content: string
}

// Get all posts sorted by date
export async function getAllPosts(): Promise<PostMeta[]> {
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = readingTime(content)

      return {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || 'general',
        image: data.image || null,
        author: data.author || 'RetrofitAge Team',
        readingTime: stats.text,
        tags: data.tags || [],
        featured: data.featured || false,
      } as PostMeta
    })

  // Sort posts by date (newest first)
  return allPosts.sort((a, b) => {
    if (a.date < b.date) return 1
    if (a.date > b.date) return -1
    return 0
  })
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`)
  const mdPath = path.join(postsDirectory, `${slug}.md`)
  
  let fullPath: string
  if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath
  } else if (fs.existsSync(mdPath)) {
    fullPath = mdPath
  } else {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  return {
    slug,
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category || 'general',
    image: data.image || null,
    author: data.author || 'RetrofitAge Team',
    readingTime: stats.text,
    tags: data.tags || [],
    featured: data.featured || false,
    content,
  }
}

// Get posts by category
export async function getPostsByCategory(category: string): Promise<PostMeta[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.category === category)
}

// Get all categories
export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllPosts()
  const categories = new Set(allPosts.map((post) => post.category))
  return Array.from(categories)
}

// Get all slugs for static paths
export async function getAllPostSlugs(): Promise<{ category: string; slug: string }[]> {
  const allPosts = await getAllPosts()
  return allPosts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }))
}

// Get related posts (by tags first, then same category, different slug)
export async function getRelatedPosts(slug: string, category: string, tags: string[] = [], limit = 3): Promise<PostMeta[]> {
  const allPosts = await getAllPosts()
  const currentPost = allPosts.find(p => p.slug === slug)
  
  // Score posts by relevance
  const scoredPosts = allPosts
    .filter((post) => post.slug !== slug) // Exclude current post
    .map((post) => {
      let score = 0
      
      // Same category = 2 points
      if (post.category === category) {
        score += 2
      }
      
      // Shared tags = 1 point each
      if (tags.length > 0 && post.tags) {
        const sharedTags = tags.filter(tag => post.tags?.includes(tag))
        score += sharedTags.length
      }
      
      // Same author = 0.5 points
      if (currentPost?.author && post.author === currentPost.author) {
        score += 0.5
      }
      
      return { post, score }
    })
    .filter(({ score }) => score > 0) // Only include posts with some relevance
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, limit)
    .map(({ post }) => post)
  
  // If not enough related posts, fill with recent posts from same category
  if (scoredPosts.length < limit) {
    const remaining = allPosts
      .filter((post) => 
        post.slug !== slug && 
        post.category === category &&
        !scoredPosts.find(p => p.slug === post.slug)
      )
      .slice(0, limit - scoredPosts.length)
    
    scoredPosts.push(...remaining)
  }
  
  return scoredPosts.slice(0, limit)
}

