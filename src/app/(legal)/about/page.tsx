import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us - RetrofitAge',
  description: 'Learn about RetrofitAge - your trusted source for aging-in-place technology and home modification guides.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">About RetrofitAge</h1>
      
      <div className="prose prose-lg prose-slate max-w-none">
        <p className="text-xl text-slate-600 mb-8">
          RetrofitAge is dedicated to helping families make informed decisions about home modifications 
          and aging-in-place technology. Our mission is to provide engineering-grade advice that enables 
          seniors to live safely and independently in their own homes.
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">Our Mission</h2>
        <p>
          Every day, thousands of families face the challenge of adapting their homes for aging loved ones. 
          We believe that with the right information, these modifications do not have to be overwhelming or 
          confusing. Our team of engineers and healthcare professionals work together to provide:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Comprehensive guides on home safety modifications</li>
          <li>Honest product reviews and comparisons</li>
          <li>Cost analysis and budgeting advice</li>
          <li>DIY instructions and professional recommendations</li>
          <li>Information on financial assistance and insurance coverage</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">Our Expertise</h2>
        <p>
          Our content is created by a team with combined experience of over 50 years in:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Home construction and renovation</li>
          <li>Occupational therapy and accessibility consulting</li>
          <li>Smart home technology integration</li>
          <li>Senior care and gerontology</li>
          <li>Healthcare finance and insurance</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">Our Commitment</h2>
        <p>
          We are committed to providing accurate, up-to-date information that you can trust. 
          While we do earn commissions from some product recommendations (see our{' '}
          <Link href="/disclosure" className="text-primary-600 hover:underline">Affiliate Disclosure</Link>), 
          our reviews and recommendations are always based on genuine research and expertise.
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">Contact Us</h2>
        <p>
          Have questions or suggestions? We would love to hear from you. Visit our{' '}
          <Link href="/contact" className="text-primary-600 hover:underline">Contact Page</Link>{' '}
          to get in touch with our team.
        </p>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-primary-800 mb-2">Start Exploring</h3>
          <p className="text-primary-700 mb-4">
            Ready to make your home safer? Browse our comprehensive guides by category:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/bathroom-safety" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Bathroom Safety
            </Link>
            <Link href="/smart-home" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Smart Home
            </Link>
            <Link href="/finance-insurance" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Finance & Insurance
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

