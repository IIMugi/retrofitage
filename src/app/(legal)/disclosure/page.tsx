import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure - RetrofitAge',
  description: 'RetrofitAge affiliate disclosure - transparency about how we earn commissions from product recommendations.',
}

export default function DisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Affiliate Disclosure</h1>
      <p className="text-slate-500 mb-8">Last updated: November 27, 2025</p>
      
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <p className="text-lg text-amber-800 font-medium">
          <strong>In short:</strong> We may earn commissions when you purchase products through our links. 
          This does not cost you anything extra, and it helps us continue creating helpful content.
        </p>
      </div>

      <div className="prose prose-lg prose-slate max-w-none">
        <h2>Our Commitment to Transparency</h2>
        <p>
          At RetrofitAge, we believe in complete transparency with our readers. This page explains how we 
          earn money and how it affects the content we create.
        </p>

        <h2>Amazon Associates Program</h2>
        <p>
          RetrofitAge is a participant in the Amazon Services LLC Associates Program, an affiliate 
          advertising program designed to provide a means for sites to earn advertising fees by 
          advertising and linking to Amazon.com.
        </p>
        <p>
          <strong>What this means:</strong> When you click on product links on our site and make a 
          purchase on Amazon, we may receive a small commission (typically 1-10% of the purchase price). 
          This commission comes from Amazon, not from you – you pay the same price whether you use our 
          link or not.
        </p>

        <h2>Other Affiliate Partnerships</h2>
        <p>
          In addition to Amazon, we may have affiliate relationships with other companies, including 
          but not limited to:
        </p>
        <ul>
          <li>Home improvement retailers</li>
          <li>Medical equipment suppliers</li>
          <li>Smart home technology companies</li>
          <li>Insurance and financial service providers</li>
        </ul>

        <h2>How This Affects Our Content</h2>
        
        <h3>What We Promise:</h3>
        <ul>
          <li>
            <strong>Honest Reviews:</strong> We only recommend products we genuinely believe are helpful. 
            Our reviews are based on research, expert knowledge, and user feedback – not commission rates.
          </li>
          <li>
            <strong>No Pay-for-Play:</strong> Companies cannot pay us to write positive reviews. Our editorial content is independent of our affiliate relationships.
          </li>
          <li>
            <strong>Clear Disclosure:</strong> We include affiliate disclosure notices on pages with 
            product recommendations.
          </li>
          <li>
            <strong>Best Recommendations First:</strong> We always recommend what we believe is the best 
            option for our readers, even if a competing product offers a higher commission.
          </li>
        </ul>

        <h3>What We Won't Do:</h3>
        <ul>
          <li>Recommend products solely because they offer high commissions</li>
          <li>Hide negative aspects of products we promote</li>
          <li>Recommend products that are not relevant or helpful to our readers</li>
          <li>Create fake reviews or misleading comparisons</li>
        </ul>

        <h2>Advertising (Google AdSense)</h2>
        <p>
          In addition to affiliate marketing, we display advertisements through Google AdSense. These ads 
          help support our site and keep our content free for readers. The ads you see are selected by 
          Google based on various factors and do not represent our endorsement of any product or service.
        </p>

        <h2>Why We Use Affiliate Marketing</h2>
        <p>
          Creating high-quality, well-researched content takes significant time and resources. Affiliate 
          commissions and advertising help us:
        </p>
        <ul>
          <li>Keep our content free for all readers</li>
          <li>Invest in thorough research and fact-checking</li>
          <li>Regularly update our guides with new information</li>
          <li>Maintain and improve our website</li>
        </ul>

        <h2>Questions?</h2>
        <p>
          If you have any questions about our affiliate relationships or how we make money, please do not 
          hesitate to{' '}
          <a href="/contact" className="text-primary-600 hover:underline">contact us</a>. 
          We're happy to provide more details.
        </p>

        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mt-8">
          <h3 className="text-xl font-semibold text-primary-800 mb-2">Thank You</h3>
          <p className="text-primary-700">
            Thank you for supporting RetrofitAge by using our affiliate links. Your trust means everything 
            to us, and we are committed to earning it every day with honest, helpful content.
          </p>
        </div>
      </div>
    </div>
  )
}

