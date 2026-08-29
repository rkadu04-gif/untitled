import React from 'react';
import { Product } from '../../types';
import { Sparkles, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  navigate: (path: string) => void;
  badgeText?: string;
  rank?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  navigate,
  badgeText,
  rank
}) => {
  const displayLabel = badgeText || product.recommendationLabel || (product.isFeatured ? "Editor's Choice" : undefined);
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.discountedPrice);
  const formattedOriginalPrice = product.originalPrice > product.discountedPrice
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.originalPrice)
    : null;

  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;

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
      id={`product-card-${product.productId}`}
      onClick={() => navigate(`/product/${product.slug || product.productId}`)}
      className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Media & Badge Area */}
      <div>
        <div className="relative aspect-[4/3] bg-slate-50/80 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
          {/* Rank Badge if provided */}
          {rank !== undefined && (
            <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow">
              #{rank}
            </div>
          )}

          {/* Recommendation Badge */}
          {displayLabel && (
            <div className={`absolute top-3 ${rank !== undefined ? 'left-12' : 'left-3'} z-10 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-sm ${
              displayLabel.includes("Editor's Choice")
                ? 'bg-indigo-600 text-white'
                : displayLabel.includes('Best Value')
                ? 'bg-emerald-600 text-white'
                : displayLabel.includes('Best Premium')
                ? 'bg-slate-900 text-white'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              <Sparkles className="w-3 h-3" />
              <span>{displayLabel}</span>
            </div>
          )}

          {/* Editorial Score Tag */}
          <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-md bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1 shadow">
            <span className="text-amber-400 font-extrabold">{product.recommendationScore}</span>
            <span className="text-slate-400 text-[9px]">/10</span>
          </div>

          {/* Image */}
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback image if broken
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2.5">
          {/* Category & Store Meta */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="uppercase tracking-widest text-[10px] font-bold text-indigo-600">
              {product.categoryId}
            </span>
            <span className="text-slate-400 text-[11px]">
              Store: {product.store || 'Amazon'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
            {product.title}
          </h3>

          {/* Why We Recommend It (Editorial Snippet) */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            "{product.bestFor || product.description.slice(0, 95) + '...'}"
          </p>
        </div>
      </div>

      {/* Pricing & CTA Action Footer */}
      <div className="p-4 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          {/* Price Block */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
            {hasDiscount ? (
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                {product.discountPercentage}% OFF
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 block">Verified Price</span>
            )}
          </div>

          {/* View Deal Button */}
          <button
            id={`btn-view-deal-${product.productId}`}
            onClick={handleAffiliateClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
          >
            <span>View Deal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
