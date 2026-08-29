import React from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { BookOpen, Sparkles, ArrowRight, User, Calendar } from 'lucide-react';

interface BuyingGuidesPageProps {
  navigate: (path: string) => void;
}

export const BuyingGuidesPage: React.FC<BuyingGuidesPageProps> = ({ navigate }) => {
  const { buyingGuides } = useApp();
  const publishedGuides = buyingGuides.filter(g => g.published);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="Technology Buying Guides & In-Depth Rankings"
        description="Comprehensive tech buying guides, benchmark comparisons, and purchase advice from Deals of the Day editors."
        canonicalUrl="/guides"
      />

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Editorial Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Expert Buying Guides
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Everything you need to know before spending your money on smartphones, laptops, audio gear, and tech accessories in India.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedGuides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => navigate(`/guides/${guide.slug || guide.id}`)}
            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between hover:border-indigo-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {guide.categoryId}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {guide.products.length} Products Ranked
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">
                {guide.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {guide.introduction}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{guide.author?.name || 'Deals of the Day Editorial'}</span>
              </div>
              <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
