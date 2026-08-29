import React from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { RankedProductItem } from '../components/ui/RankedProductItem';
import {
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Tag,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle
} from 'lucide-react';

interface BestCategoryPageProps {
  categoryId: string;
  navigate: (path: string) => void;
}

export const BestCategoryPage: React.FC<BestCategoryPageProps> = ({
  categoryId,
  navigate
}) => {
  const { getCategoryBySlug, getRankedProductsForBestCategory, settings } = useApp();

  const category = getCategoryBySlug(categoryId);
  const resolvedCategoryId = category ? category.id : categoryId;
  const rankedItems = getRankedProductsForBestCategory(resolvedCategoryId);

  const categoryName = category ? category.name : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  const pageTitle = category?.bestPicksTitle || category?.seoTitle || `Best ${categoryName} to Buy in India (${new Date().getFullYear()})`;
  const pageDesc = category?.bestPicksDescription || category?.metaDescription || `We compare specifications, performance, battery life, cameras, and current prices to help you choose the best ${categoryName.toLowerCase()}.`;

  // ItemList schema for Google Rich Results
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    description: pageDesc,
    itemListElement: rankedItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.product.title,
      url: `${settings.siteUrl || 'https://dealsofthedayonline.in'}/product/${item.product.slug || item.product.productId}`
    }))
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={pageTitle}
        description={pageDesc}
        canonicalUrl={`/best/${categoryId}`}
        schema={itemListSchema}
      />

      {/* Back & Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <button
          onClick={() => navigate('/')}
          className="hover:text-indigo-600 flex items-center gap-1"
        >
          <span>Home</span>
        </button>
        <span>/</span>
        <button
          onClick={() => navigate('/categories')}
          className="hover:text-indigo-600"
        >
          Categories
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Best {categoryName}</span>
      </div>

      {/* Editorial Header Section */}
      <header className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tested & Ranked by Deals of the Day</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
          {category?.bestPicksTitle || `Best ${categoryName} to Buy in India`}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
          {category?.bestPicksDescription || `We compare real-world performance, build quality, key specifications, and daily deals to help you pick the best ${categoryName.toLowerCase()} without overpaying.`}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" /> Updated for {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
          </span>
          <span>•</span>
          <span>{rankedItems.length} Products Ranked</span>
          <span>•</span>
          <button
            onClick={() => navigate(`/category/${categoryId}`)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
          >
            View all {categoryName} deals &rarr;
          </button>
        </div>
      </header>

      {/* Quick Summary Jump Links */}
      {rankedItems.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Quick Comparison & Rankings Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rankedItems.map((item) => (
              <a
                key={item.product.productId}
                href={`#ranked-item-${item.product.productId}`}
                className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/90 hover:border-indigo-400 transition-colors flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                    #{item.rank} {item.label}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.product.title}
                  </h4>
                  <div className="text-[11px] font-black text-slate-900">
                    ₹{item.product.discountedPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center text-slate-400 text-xs shrink-0 ml-2">
                  &darr;
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main Ranked Products List */}
      <section className="space-y-8">
        {rankedItems.length > 0 ? (
          rankedItems.map((item) => (
            <RankedProductItem
              key={item.product.productId}
              product={item.product}
              rank={item.rank}
              label={item.label}
              navigate={navigate}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Rankings Coming Soon
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Our editors are currently testing the latest {categoryName.toLowerCase()} models. Check back shortly or upload products via the Admin panel.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              Back to Home
            </button>
          </div>
        )}
      </section>

      {/* Editorial Buyer's Guide & How We Test */}
      <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>How We Rank & Test {categoryName}</span>
        </h3>
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
          <p>
            Every product in this list has been evaluated against rigorous criteria including build materials, sustained processing performance, battery efficiency, audio/display calibration, and overall value.
          </p>
          <p>
            We regularly update this guide as new products release in India and live prices fluctuate. Affiliate commissions do not dictate ranking order or editorial verdicts.
          </p>
        </div>
      </section>
    </div>
  );
};
