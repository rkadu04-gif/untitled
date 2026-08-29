import React from 'react';
import { useApp } from '../../context/AppContext';
import { Send, Shield, Sparkles, CheckCircle2, ExternalLink, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings, categories } = useApp();
  const telegramUrl = settings?.telegramUrl || 'https://t.me/dealsoftheday004';

  const activeCategories = categories.filter(c => c.active).slice(0, 6);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Editorial Trust Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-start gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Independent Product Research</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                We independently test, analyze, and rank every product based on merit, not brand sponsorship.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Deals & Prices</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Every deal and discount percentage is calculated against genuine manufacturer MRP prices.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Affiliate Transparency</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                We may earn a commission when you buy through our links. This never impacts our editorial ratings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Telegram */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                DEALS <span className="text-indigo-400 font-medium">OF THE DAY</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's premier technology product recommendation and buying guide publication. We help smart consumers choose the right smartphones, laptops, audio gear, and gadgets without marketing hype.
            </p>

            <div className="pt-2">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow hover:shadow-indigo-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Join Official Telegram Channel</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
              </a>
              <span className="block text-[11px] text-slate-500 mt-1.5">
                Instant price drop alerts & handpicked tech deals.
              </span>
            </div>
          </div>

          {/* Best Rankings */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Best Picks
            </h3>
            <ul className="space-y-2 text-xs">
              {activeCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/best/${cat.id}`)}
                    className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                  >
                    Best {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/guides')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold text-left"
                >
                  All Buying Guides &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Categories & Deals */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/deals')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                >
                  Today's Best Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/categories')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                >
                  Product Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/compare')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                >
                  Compare Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/search')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                >
                  Global Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-left flex items-center gap-1"
                >
                  <span>Admin Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Editorial */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Editorial & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/affiliate-disclosure')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-left font-medium"
                >
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                >
                  About Our Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclaimer Note */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Affiliate Disclosure:</strong> Deals of the Day (dealsofthedayonline.in) is an independent product recommendation website. We do not stock or sell products directly. When you click on links to retailers like Amazon, Flipkart, or brand stores, we may earn an affiliate commission on qualifying purchases. Prices, stock status, and deal terms are subject to change by respective retailers.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
            <div>
              © {new Date().getFullYear()} Deals of the Day. All rights reserved. Built for discerning Indian consumers.
            </div>
            <div>
              Domain: <span className="text-slate-400 font-mono">dealsofthedayonline.in</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
