import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { ShieldCheck, Mail, Send, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title="About Us | Deals of the Day"
        description="Learn about Deals of the Day, India's leading independent technology recommendation and product ranking platform."
        canonicalUrl="/about"
      />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
          About Deals of the Day
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Helping consumers across India make confident, regret-free tech purchases through honest testing, ranked picks, and verified deals.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 font-serif">Our Philosophy</h2>
        <p>
          Founded with a single objective: to eliminate buyer confusion in a market flooded with sponsored social media reviews and marketing hyperbole. We research and test smartphones, laptops, audio products, smartwatches, and tech accessories to tell you what is genuinely worth buying.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">Independent</h3>
            <p className="text-xs text-slate-600">No brand sponsorships dictate our top picks or editorial scores.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Price-Conscious</h3>
            <p className="text-xs text-slate-600">We optimize recommendations for the best price-to-performance ratio in INR.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">Live Updates</h3>
            <p className="text-xs text-slate-600">Rankings adapt dynamically as new hardware launches and prices change.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { settings } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title="Contact Editorial Team | Deals of the Day"
        description="Get in touch with the Deals of the Day team for product inquiries, corrections, or editorial feedback."
        canonicalUrl="/contact"
      />

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
          Contact Us
        </h1>
        <p className="text-sm text-slate-600">
          Have a product review question, price correction, or general inquiry? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold font-serif">Direct Email</h3>
            <p className="text-xs text-slate-300">
              For editorial inquiries and corrections:
            </p>
            <a href={`mailto:${settings.contactEmail || 'contact@dealsofthedayonline.in'}`} className="text-xs font-mono text-orange-400 block break-all">
              {settings.contactEmail || 'contact@dealsofthedayonline.in'}
            </a>
          </div>

          <div className="bg-sky-50 border border-sky-100 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-sky-900 font-serif">Telegram Community</h3>
            <p className="text-xs text-sky-700">
              Join our real-time deal alerts channel:
            </p>
            <a
              href={settings.telegramUrl || 'https://t.me/dealsoftheday004'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800"
            >
              <Send className="w-3.5 h-3.5" />
              <span>@dealsoftheday</span>
            </a>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for contacting Deals of the Day. Our editorial team will review your message shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Rahul Sharma"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="rahul@example.com"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Product inquiry or price correction"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all shadow"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-sm text-slate-700">
      <SEOHead title="Privacy Policy | Deals of the Day" description="Our privacy practices regarding cookies, analytics, and affiliate tracking." canonicalUrl="/privacy-policy" />
      <h1 className="text-3xl font-extrabold text-slate-900 font-serif">Privacy Policy</h1>
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-4 leading-relaxed">
        <p>Deals of the Day (dealsofthedayonline.in) values your privacy. We do not sell personal data to third parties.</p>
        <h3 className="font-bold text-slate-900">Cookies & Analytics</h3>
        <p>We use standard anonymous web cookies and analytics to understand which guides and products are most useful to readers.</p>
        <h3 className="font-bold text-slate-900">Affiliate Links</h3>
        <p>When you click an outbound link to a merchant, that merchant may place a temporary session cookie on your device to attribute referral credit.</p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-sm text-slate-700">
      <SEOHead title="Terms of Service | Deals of the Day" description="Terms of service and usage for Deals of the Day." canonicalUrl="/terms" />
      <h1 className="text-3xl font-extrabold text-slate-900 font-serif">Terms of Service</h1>
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-4 leading-relaxed">
        <p>All content on Deals of the Day is for informational and editorial product recommendation purposes only.</p>
        <h3 className="font-bold text-slate-900">No Direct Sales Guarantee</h3>
        <p>We do not sell products directly. Product warranties, fulfillment, and customer service are the sole responsibility of the merchant you purchase from.</p>
      </div>
    </div>
  );
};
