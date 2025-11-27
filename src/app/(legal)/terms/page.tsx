import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - RetrofitAge',
  description: 'Terms of service for using the RetrofitAge website.',
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Terms of Service</h1>
      <p className="text-slate-500 mb-8">Last updated: November 27, 2025</p>
      
      <div className="prose prose-lg prose-slate max-w-none">
        <p>
          Welcome to RetrofitAge. By accessing and using our website retrofitage.com (the &quot;Site&quot;), 
          you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, 
          please do not use our Site.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By using this Site, you confirm that you are at least 18 years old or have parental consent, and that you agree to comply with and be bound by these Terms.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          RetrofitAge provides informational content about aging-in-place technology, home modifications, 
          and related topics. Our content is for educational purposes only and should not be considered 
          professional medical, legal, or financial advice.
        </p>

        <h2>3. Disclaimer of Warranties</h2>
        <p>
          THE SITE AND ITS CONTENT ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. We make no 
          warranties, expressed or implied, regarding:
        </p>
        <ul>
          <li>The accuracy, completeness, or reliability of any content</li>
          <li>The suitability of any information for your specific situation</li>
          <li>The availability or uninterrupted access to the Site</li>
          <li>The safety or effectiveness of any products mentioned</li>
        </ul>

        <h2>4. Professional Advice Disclaimer</h2>
        <p>
          <strong>Important:</strong> The information on this Site is not a substitute for professional advice. 
          Always consult with qualified professionals before:
        </p>
        <ul>
          <li>Making home modifications or renovations</li>
          <li>Purchasing medical equipment or assistive devices</li>
          <li>Making financial decisions about reverse mortgages or insurance</li>
          <li>Making healthcare decisions for yourself or loved ones</li>
        </ul>

        <h2>5. Product Recommendations and Affiliate Links</h2>
        <p>
          Our Site contains product recommendations and affiliate links. When you click these links and 
          make a purchase, we may earn a commission at no additional cost to you. See our{' '}
          <Link href="/disclosure" className="text-primary-600 hover:underline">Affiliate Disclosure</Link>{' '}
          for more information.
        </p>
        <p>
          Product information, prices, and availability are subject to change without notice. We do not 
          guarantee the accuracy of pricing or product specifications.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All content on this Site, including text, graphics, logos, and images, is the property of 
          RetrofitAge or its content suppliers and is protected by copyright laws. You may not:
        </p>
        <ul>
          <li>Reproduce or distribute our content without permission</li>
          <li>Modify or create derivative works from our content</li>
          <li>Use our content for commercial purposes without authorization</li>
        </ul>

        <h2>7. User Conduct</h2>
        <p>When using our Site, you agree not to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Transmit harmful, offensive, or illegal content</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with the proper functioning of the Site</li>
          <li>Collect user information without consent</li>
        </ul>

        <h2>8. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, RETROFITAGE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SITE, 
          INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul>
          <li>Personal injury or property damage</li>
          <li>Loss of profits or data</li>
          <li>Business interruption</li>
          <li>Reliance on any information provided on the Site</li>
        </ul>

        <h2>9. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless RetrofitAge and its affiliates from any claims, 
          damages, or expenses arising from your use of the Site or violation of these Terms.
        </p>

        <h2>10. Third-Party Links</h2>
        <p>
          Our Site may contain links to third-party websites. We are not responsible for the content, 
          privacy practices, or terms of service of these external sites.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be effective immediately 
          upon posting to the Site. Your continued use of the Site after changes constitutes acceptance 
          of the modified Terms.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the United States, 
          without regard to its conflict of law provisions.
        </p>

        <h2>13. Contact Information</h2>
        <p>
          For questions about these Terms, please contact us at:{' '}
          <a href="mailto:legal@retrofitage.com" className="text-primary-600 hover:underline">
            legal@retrofitage.com
          </a>
        </p>
      </div>
    </div>
  )
}

