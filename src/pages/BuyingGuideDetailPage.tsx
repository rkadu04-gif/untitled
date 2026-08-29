import React from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { RankedProductItem } from '../components/ui/RankedProductItem';
import {
  BookOpen,
  Calendar,
  User,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface BuyingGuideDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const BuyingGuideDetailPage: React.FC<BuyingGuideDetailPageProps> = ({ slug, navigate }) => {
  const { getBuyingGuideBySlug, getProductBySlug, categories } = useApp();
  const guide = getBuyingGuideBySlug(slug);

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">Guide Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested buying guide could not be located.
        </p>
        <button
          onClick={() => navigate('/guides')}
          className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
        >
          View All Buying Guides
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id.toLowerCase() === guide.categoryId.toLowerCase());
  const categoryName = category ? category.name : guide.categoryId;

  // Resolve ranked products
  const rankedItems = guide.products
    .map(gp => {
      const p = getProductBySlug(gp.productId);
      return p ? { product: p, rank: gp.order, label: gp.label, reason: gp.customReason } : null;
    })
    .filter(Boolean) as { product: any; rank: number; label: string; reason?: string }[];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription || guide.introduction,
    author: {
      '@type': 'Person',
      name: guide.author?.name || 'Deals of the Day Editorial Team'
    },
    dateModified: guide.updatedAt || new Date().toISOString()
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={guide.seoTitle || `${guide.title} | Deals of the Day`}
        description={guide.metaDescription || guide.introduction}
        canonicalUrl={`/guides/${guide.slug || guide.id}`}
        ogType="article"
        schema={articleSchema}
      />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <button onClick={() => navigate('/')} className="hover:text-indigo-600">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/guides')} className="hover:text-indigo-600">Buying Guides</button>
        <span>/</span>
        <span className="text-slate-900 font-semibold line-clamp-1">{guide.title}</span>
      </div>

      {/* Hero Header */}
      <header className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            {categoryName} Buying Guide
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          {guide.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
          {guide.introduction}
        </p>

        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <User className="w-4 h-4 text-slate-400" />
              <span>{guide.author?.name || 'Lead Hardware Editor'} ({guide.author?.role || 'Tech Reviewer'})</span>
            </span>
          </div>

          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" /> Updated {guide.updatedAt || 'August 2026'}
          </span>
        </div>
      </header>

      {/* Verdict Summary Box */}
      {guide.verdictSummary && (
        <div className="bg-indigo-50/80 rounded-xl p-6 border border-indigo-200 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>The Quick Verdict</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
            {guide.verdictSummary}
          </p>
        </div>
      )}

      {/* Ranked Products */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Our Top Recommendations
        </h2>

        {rankedItems.map((item) => (
          <RankedProductItem
            key={item.product.productId}
            product={item.product}
            rank={item.rank}
            label={item.label}
            navigate={navigate}
          />
        ))}
      </section>

      {/* Related Category Links */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Want to see all {categoryName} rankings and deals?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare complete benchmark scores and price tracking data.
          </p>
        </div>

        <button
          onClick={() => navigate(`/best/${guide.categoryId}`)}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow shrink-0 flex items-center gap-1.5"
        >
          <span>Best {categoryName} Page</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
