import React from 'react';
import { Product } from '../../types';
import {
  Sparkles,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface RankedProductItemProps {
  product: Product;
  rank: number;
  label: string;
  navigate: (path: string) => void;
}

export const RankedProductItem: React.FC<RankedProductItemProps> = ({
  product,
  rank,
  label,
  navigate
}) => {
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.discountedPrice);
  const formattedOriginalPrice = product.originalPrice > product.discountedPrice
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.originalPrice)
    : null;

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/product/${product.slug || product.productId}`);
    }
  };

  const specsList = product.specifications ? Object.entries(product.specifications).slice(0, 6) : [];

  return (
    <div
      id={`ranked-item-${product.productId}`}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
    >
      {/* Header Banner with Rank and Label */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 font-black text-sm flex items-center justify-center text-white shadow">
            #{rank}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block">
              {label}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {product.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Rating</span>
            <span className="text-sm font-extrabold text-amber-400">
              {product.recommendationScore} <span className="text-slate-400 text-xs font-normal">/ 10</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Gallery & Buy CTA Box (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="relative aspect-square bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Pricing & Buy Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Best Live Price
                </span>
                <span className="text-xl font-black text-slate-900">{formattedPrice}</span>
                {formattedOriginalPrice && (
                  <span className="text-xs text-slate-400 line-through ml-2">
                    {formattedOriginalPrice}
                  </span>
                )}
              </div>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-500">
              Available at: <strong className="text-slate-800">{product.store || 'Amazon India'}</strong>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleBuyClick}
                className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Buy Now on {product.store || 'Amazon'}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate(`/product/${product.slug || product.productId}`)}
                className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span>Read Full In-Depth Review</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Analysis, Pros/Cons, Specs (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Best For Tag */}
          {product.bestFor && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>BEST FOR: {product.bestFor}</span>
            </div>
          )}

          {/* Why We Recommend It */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Why We Recommend It</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pros and Cons Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Pros */}
            <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-100/80">
              <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Reasons to Buy (Pros)</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {product.pros && product.pros.length > 0 ? (
                  product.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">Top tier performance & durability</li>
                )}
              </ul>
            </div>

            {/* Cons */}
            <div className="bg-rose-50/50 rounded-xl p-3.5 border border-rose-100/80">
              <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1">
                <X className="w-4 h-4 text-rose-600" />
                <span>Reasons to Avoid (Cons)</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {product.cons && product.cons.length > 0 ? (
                  product.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">Premium price segment</li>
                )}
              </ul>
            </div>
          </div>

          {/* Key Specifications Grid */}
          {specsList.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Key Specifications
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {specsList.map(([key, val]) => (
                  <div key={key} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                      {key}
                    </span>
                    <span className="text-slate-800 font-medium line-clamp-2">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
