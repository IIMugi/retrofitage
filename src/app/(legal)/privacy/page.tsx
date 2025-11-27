import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - RetrofitAge',
  description: 'RetrofitAge privacy policy - how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Privacy Policy</h1>
      <p className="text-slate-500 mb-8">Last updated: November 27, 2025</p>
      
      <div className="prose prose-lg prose-slate max-w-none">
        <p>
          RetrofitAge (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy 
          explains how we collect, use, disclose, and safeguard your information when you visit our website 
          retrofitage.com (the &quot;Site&quot;).
        </p>

        <h2>Information We Collect</h2>
        
        <h3>Information You Provide</h3>
        <p>We may collect information you voluntarily provide, including:</p>
        <ul>
          <li>Name and email address (when subscribing to our newsletter)</li>
          <li>Contact information (when using our contact form)</li>
          <li>Any other information you choose to provide</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <p>When you visit our Site, we may automatically collect:</p>
        <ul>
          <li>Device information (browser type, operating system)</li>
          <li>IP address and approximate location</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Provide and maintain our Site</li>
          <li>Send newsletters and updates (with your consent)</li>
          <li>Respond to your inquiries and requests</li>
          <li>Analyze usage patterns to improve our content</li>
          <li>Display relevant advertisements</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to enhance your experience. These include:
        </p>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (Google Analytics)</li>
          <li><strong>Advertising Cookies:</strong> Used to display relevant ads (Google AdSense)</li>
        </ul>
        <p>
          You can control cookies through your browser settings. Note that disabling certain cookies 
          may affect site functionality.
        </p>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Google Analytics:</strong> For website analytics and usage data</li>
          <li><strong>Google AdSense:</strong> For displaying advertisements</li>
          <li><strong>Amazon Associates:</strong> For affiliate product recommendations</li>
        </ul>
        <p>
          These services have their own privacy policies. We encourage you to review them.
        </p>

        <h2>Advertising</h2>
        <p>
          We use Google AdSense to display advertisements. Google may use cookies to serve ads based 
          on your prior visits to this site or other websites. You can opt out of personalized advertising 
          by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Ads Settings</a>.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement reasonable security measures to protect your information. However, no method of 
          transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Opt out of marketing communications</li>
          <li>Object to certain processing activities</li>
        </ul>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our Site is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by 
          posting the new policy on this page and updating the &quot;Last updated&quot; date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:{' '}
          <a href="mailto:privacy@retrofitage.com" className="text-primary-600 hover:underline">
            privacy@retrofitage.com
          </a>
        </p>
      </div>
    </div>
  )
}

