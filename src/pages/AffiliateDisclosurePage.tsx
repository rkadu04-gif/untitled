import React from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';

export const AffiliateDisclosurePage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title="Affiliate & Editorial Disclosure | Deals of the Day"
        description="Learn how Deals of the Day maintains complete editorial independence while earning affiliate commissions on qualifying purchases."
        canonicalUrl="/affiliate-disclosure"
      />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparency & Trust</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
          Affiliate & Editorial Disclosure
        </h1>
        <p className="text-sm text-slate-500">
          Last updated: August 2026 • Published by Deals of the Day Editorial Standards Board
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6 leading-relaxed bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-serif">1. Our Core Editorial Mission</h2>
          <p>
            <strong>Deals of the Day</strong> (<span className="text-orange-600 font-mono">dealsofthedayonline.in</span>) is an independent product recommendation and buying guide publication based in India. Our mission is to provide consumers with rigorous, truthful, and research-backed buying advice across smartphones, laptops, audio gear, and personal technology.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-serif">2. How We Earn Revenue (Affiliate Partnerships)</h2>
          <p>
            To keep our buying guides, rankings, and deal trackers free of paywalls, we participate in various affiliate marketing programs. This means that when you click on links on our website to retailer partners (such as Amazon India, Flipkart, or official brand webstores) and make a qualifying purchase, we may receive a small referral commission at <strong>no additional cost to you</strong>.
          </p>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-xs text-orange-950 font-medium">
            <strong>Key Guarantee:</strong> You will never pay higher prices by clicking through our links. In fact, we frequently track and showcase exclusive coupons, bank discounts, and price drops to ensure you pay the lowest possible amount.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-serif">3. 100% Editorial Independence</h2>
          <p>
            Our product rankings, "Editor's Choice" awards, score calculations (out of 10), and pros/cons analyses are determined solely by our editorial team based on:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Hardware benchmark analysis (CPU/GPU performance, thermals, battery life)</li>
            <li>Real-world camera and display color calibration tests</li>
            <li>Build materials, ergonomics, and long-term software support commitments</li>
            <li>Value-for-money relative to competitor products in the Indian market</li>
          </ul>
          <p>
            Retailers and manufacturers <strong>cannot</strong> pay to alter rankings, remove negative criticisms, or purchase higher recommendation scores. If a device has poor battery life or bloatware, we state it openly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-serif">4. Accuracy of Prices and Stock Status</h2>
          <p>
            While our automated price trackers and editors verify prices regularly, e-commerce retailers frequently adjust deals, exchange rates, and stock availability without warning. Please confirm the final checkout price on the retailer's website before completing any transaction.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-serif">5. Contact Our Editorial Team</h2>
          <p>
            If you have questions about our testing methodology, affiliate relationships, or notice an outdated price, please reach out directly at <strong className="text-slate-900">{settings.contactEmail || 'contact@dealsofthedayonline.in'}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
