import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - RetrofitAge',
  description: 'Get in touch with the RetrofitAge team. We\'re here to help with your aging-in-place questions.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-6">Contact Us</h1>
        
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-8">
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Have questions about home modifications, product recommendations, or our content? 
            We are here to help! Fill out the form below or reach out directly via email.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">Send Us a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a topic...</option>
                  <option value="question">General Question</option>
                  <option value="suggestion">Content Suggestion</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="correction">Report an Error</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Send Message
              </button>
            </form>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              We typically respond within 24-48 hours.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">Other Ways to Reach Us</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white">Email</h3>
                    <a href="mailto:contact@retrofitage.com" className="text-primary-600 dark:text-primary-400 hover:underline">
                      contact@retrofitage.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white">Response Time</h3>
                    <p className="text-slate-600 dark:text-slate-300">24-48 hours on business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">📋 Before You Contact Us</h3>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
              Many questions are answered in our detailed guides. Try searching our site first - 
              you might find exactly what you are looking for!
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Content Suggestions</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
              Have an idea for a topic we should cover? We love hearing from our readers! 
              Let us know what aging-in-place challenges you would like us to address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
