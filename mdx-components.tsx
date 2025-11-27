import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings with anchor links
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-slate-800 mt-8 mb-4 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-slate-700 mt-8 mb-3 border-b border-slate-200 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium text-slate-700 mt-6 mb-2">
        {children}
      </h3>
    ),
    // Paragraphs - larger font for accessibility
    p: ({ children }) => (
      <p className="text-lg text-slate-600 leading-relaxed mb-4">
        {children}
      </p>
    ),
    // Links
    a: ({ href, children }) => (
      <Link
        href={href || '#'}
        className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
      >
        {children}
      </Link>
    ),
    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-lg text-slate-600 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-lg text-slate-600 ml-4">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    // Blockquotes for callouts
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-4 my-4 rounded-r-lg italic text-slate-700">
        {children}
      </blockquote>
    ),
    // Code blocks
    code: ({ children }) => (
      <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-base font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4 text-base">
        {children}
      </pre>
    ),
    // Images with optimization
    img: ({ src, alt }) => (
      <figure className="my-6">
        <Image
          src={src || '/placeholder.jpg'}
          alt={alt || 'Image'}
          width={800}
          height={450}
          className="rounded-lg shadow-md w-full h-auto"
        />
        {alt && (
          <figcaption className="text-center text-sm text-slate-500 mt-2 italic">
            {alt}
          </figcaption>
        )}
      </figure>
    ),
    // Tables for comparison content
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-slate-200 rounded-lg">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="bg-slate-100 border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-slate-200 px-4 py-3 text-slate-600">
        {children}
      </td>
    ),
    // Strong and emphasis
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-800">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-slate-700">{children}</em>
    ),
    // Horizontal rule
    hr: () => <hr className="my-8 border-t-2 border-slate-200" />,
    ...components,
  }
}

