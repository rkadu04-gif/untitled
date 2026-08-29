import React from 'react';
import { Product } from '../../types';
import { Tag, ExternalLink, ArrowRight, TrendingUp } from 'lucide-react';

interface DealCardProps {
  product: Product;
  navigate: (path: string) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ product, navigate }) => {
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.discountedPrice);
  const formattedOriginalPrice = product.originalPrice > product.discountedPrice
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.originalPrice)
    : null;

  const handleAffiliateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/product/${product.slug || product.productId}`);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.slug || product.productId}`)}
      className="group bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col sm:flex-row gap-4 items-center justify-between cursor-pointer"
    >
      {/* Product Image & Meta */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50/80 rounded-lg p-2 border border-slate-100 flex items-center justify-center shrink-0">
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
              {product.categoryId}
            </span>
            {product.isTrending && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-amber-600" />
                <span>Trending Deal</span>
              </span>
            )}
            <span className="text-xs text-slate-400">
              Store: <strong className="text-slate-700">{product.store || 'Amazon'}</strong>
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h4>

          <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block">
            {product.bestFor || product.description}
          </p>

          <div className="text-[11px] text-slate-400">
            Score: <strong className="text-slate-800">{product.recommendationScore}/10</strong> (Deals of the Day Rating)
          </div>
        </div>
      </div>

      {/* Price & View Deal */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        <div className="text-left sm:text-right">
          <div className="flex items-baseline gap-2 sm:justify-end">
            <span className="text-lg font-black text-slate-900">{formattedPrice}</span>
            {formattedOriginalPrice && (
              <span className="text-xs text-slate-400 line-through">{formattedOriginalPrice}</span>
            )}
          </div>
          {product.discountPercentage && product.discountPercentage > 0 ? (
            <span className="text-xs font-bold text-emerald-600">
              Save {product.discountPercentage}%
            </span>
          ) : (
            <span className="text-xs text-slate-400">Best price verified</span>
          )}
        </div>

        <button
          onClick={handleAffiliateClick}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>View Deal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
