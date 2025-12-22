import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/mdx'

export async function GET() {
  try {
    const posts = await getAllPosts()
    
    // Return minimal data for search
    const searchData = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      date: post.date,
      tags: post.tags || [],
    }))
    
    return NextResponse.json(searchData)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
