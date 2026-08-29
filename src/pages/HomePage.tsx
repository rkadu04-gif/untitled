import React from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { ProductCard } from '../components/ui/ProductCard';
import { CategoryCard } from '../components/ui/CategoryCard';
import { DealCard } from '../components/ui/DealCard';
import {
  Sparkles,
  Tag,
  ArrowRight,
  ShieldCheck,
  Send,
  CheckCircle2,
  TrendingUp,
  Award,
  Search,
  BookOpen,
  Zap,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { products, categories, buyingGuides, settings } = useApp();

  const telegramUrl = settings?.telegramUrl || 'https://t.me/dealsoftheday004';

  // 1. Top Recommended Products (4-6 products with high score / featured)
  const topRecommended = products
    .filter(p => p.active && p.published)
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.recommendationScore - a.recommendationScore)
    .slice(0, 6);

  // 2. Categories with active products count
  const activeCategories = categories.filter(c => c.active);

  // 3. Latest Deals with real discounts
  const latestDeals = products
    .filter(p => p.active && p.published && (p.discountPercentage || 0) > 0)
    .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
    .slice(0, 4);

  // 4. Featured Buying Guides
  const featuredGuides = buyingGuides.filter(g => g.published).slice(0, 3);

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName || 'Deals of the Day',
    url: settings.siteUrl || 'https://dealsofthedayonline.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${settings.siteUrl || 'https://dealsofthedayonline.in'}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const hp = settings.homepage || {};

  return (
    <div className="space-y-16 pb-16">
      <SEOHead
        title="Best Tech Product Recommendations & Verified Deals in India"
        description="Independent expert reviews, ranked recommendations, and live deals for smartphones, laptops, audio gear, and gadgets in India."
        schema={homeSchema}
      />

      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Subtle Editorial Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{hp.heroBadgeText || 'Honest Tech Rankings & Live Price Intelligence'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {hp.heroTitle || 'Find the Best Tech Products'} <br className="hidden sm:inline" />
            <span className="text-indigo-400">
              {hp.heroSubtitle || 'Worth Buying'}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {hp.heroDescription || 'Independent expert recommendations, honest comparisons, and verified deals across technology and everyday gadgets in India.'}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="hero-explore-best-btn"
              onClick={() => navigate(hp.exploreBestPicksLink || '/categories')}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{hp.exploreBestPicksText || 'Explore Best Picks'}</span>
            </button>

            <button
              id="hero-todays-deals-btn"
              onClick={() => navigate(hp.todaysDealsLink || '/deals')}
              className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-indigo-400" />
              <span>Today's Best Deals</span>
            </button>
          </div>

          {/* Subtle Trust Statement */}
          <div className="pt-4 text-xs text-slate-400 flex items-center justify-center gap-2 flex-wrap font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Independent recommendations • Updated prices • Affiliate-supported</span>
          </div>
        </div>

        {/* Executive Stats Metric Strip */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Picks Evaluated</div>
            <div className="text-2xl font-black text-white mt-1">120+</div>
            <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hands-on tested
            </div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Deals Active</div>
            <div className="text-2xl font-black text-white mt-1">24+</div>
            <div className="text-xs text-indigo-300 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Price verified
            </div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buying Guides</div>
            <div className="text-2xl font-black text-white mt-1">100%</div>
            <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Unbiased research
            </div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Benchmark Standard</div>
            <div className="text-2xl font-black text-white mt-1">9.8/10</div>
            <div className="text-xs text-amber-400 font-semibold mt-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Editorial rigor
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 1 — TOP RECOMMENDATIONS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
              <Award className="w-3.5 h-3.5" />
              <span>Top Rated By Editors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-1">
              Top Recommended Products
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Our editors' highest-rated picks right now across all tested categories.
            </p>
          </div>

          <button
            onClick={() => navigate('/categories')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0 group"
          >
            <span>Browse all categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid of Recommended Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRecommended.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              navigate={navigate}
            />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — BEST PICKS BY CATEGORY */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Editorial Rankings</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-1">
                Best Products by Category
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore structured rankings with #1 Editor's Choice, Best Premium, and Best Value selections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeCategories.map((cat) => {
              const count = products.filter(p => p.active && p.published && p.categoryId.toLowerCase() === cat.id.toLowerCase()).length;
              return (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  productCount={count}
                  navigate={navigate}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — BEST BUYING GUIDES */}
      {/* ============================================================ */}
      {featuredGuides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                <BookOpen className="w-3.5 h-3.5" />
                <span>In-Depth Analysis</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-1">
                Expert Buying Guides
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Comprehensive buying advice, benchmark breakdowns, and verdicts.
              </p>
            </div>

            <button
              onClick={() => navigate('/guides')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0 group"
            >
              <span>View all guides</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => navigate(`/guides/${guide.slug || guide.id}`)}
                className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {guide.categoryId}
                    </span>
                    <span className="text-xs text-slate-400">
                      {guide.products.length} Products Ranked
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {guide.introduction}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    By <strong className="text-slate-800">{guide.author?.name || 'Editorial Team'}</strong>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Guide &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 4 — LATEST DEALS / PRICE DROPS */}
      {/* ============================================================ */}
      {latestDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>Price Drops</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mt-1">
                Today's Best Deals
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Handpicked products with verified discounts from official retailers.
              </p>
            </div>

            <button
              onClick={() => navigate('/deals')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0 group"
            >
              <span>See all deals</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-3">
            {latestDeals.map((product) => (
              <DealCard
                key={product.productId}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 5 — WHY TRUST US */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 border border-slate-800">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why Trust Deals of the Day?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              We know the internet is full of sponsored hype. Our mission is simple: cut through the noise and provide dependable buying advice backed by hands-on testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Expert Product Research</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We review hardware teardowns, battery discharge tests, and benchmark performance across price tiers.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Transparent Recommendations</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear pros and cons for every pick. If a phone has bloatware or slow charging, we say it clearly.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Continuous Price Tracking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We monitor price histories across Amazon, Flipkart, and brand stores to ensure deals are authentic.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h4 className="text-sm font-bold text-white">Practical Comparisons</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Side-by-side specifications and real-world trade-offs so you only pay for features you actually use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 — TELEGRAM CTA */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Send className="w-3.5 h-3.5" />
              <span>Real-Time Tech Telegram Channel</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Never Miss a Flash Price Drop
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Get instant alerts for limited-time lightning deals, coupon codes, and price crashes delivered straight to your Telegram.
            </p>
          </div>

          <a
            id="cta-join-telegram-btn"
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Join Telegram Channel</span>
          </a>
        </div>
      </section>
    </div>
  );
};
