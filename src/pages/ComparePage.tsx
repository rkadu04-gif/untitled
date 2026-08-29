import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { Product } from '../types';
import {
  ArrowRightLeft,
  Sparkles,
  ExternalLink,
  Plus,
  X,
  Check,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface ComparePageProps {
  navigate: (path: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ navigate }) => {
  const { products, categories } = useApp();

  // Initial selected products (pick first 2 active products)
  const activeProducts = products.filter(p => p.active && p.published);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return activeProducts.slice(0, 2).map(p => p.productId);
  });

  const selectedProducts = selectedIds
    .map(id => products.find(p => p.productId === id))
    .filter(Boolean) as Product[];

  const handleAddProduct = (productId: string) => {
    if (!selectedIds.includes(productId) && selectedIds.length < 3) {
      setSelectedIds([...selectedIds, productId]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedIds(selectedIds.filter(id => id !== productId));
  };

  // Collect all unique specification keys across selected products
  const allSpecKeys = Array.from(
    new Set(
      selectedProducts.flatMap(p => p.specifications ? Object.keys(p.specifications) : [])
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="Compare Tech Specifications & Prices | Deals of the Day"
        description="Side-by-side comparison of smartphones, laptops, and tech gadgets with benchmark scores, pros, cons, and current live prices."
        canonicalUrl="/compare"
      />

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider">
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Product Comparison</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
          Compare Products Side-by-Side
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Select up to 3 products to compare editorial scores, price drops, pros, cons, and technical specifications.
        </p>
      </div>

      {/* Product Selector Dropdowns */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add to compare:</span>
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleAddProduct(e.target.value);
              e.target.value = '';
            }
          }}
          disabled={selectedIds.length >= 3}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
        >
          <option value="">+ Select a product to compare...</option>
          {activeProducts
            .filter(p => !selectedIds.includes(p.productId))
            .map(p => (
              <option key={p.productId} value={p.productId}>
                [{p.categoryId.toUpperCase()}] {p.title} - ₹{p.discountedPrice.toLocaleString('en-IN')}
              </option>
            ))}
        </select>
        {selectedIds.length >= 3 && (
          <span className="text-xs text-orange-600 font-medium">
            (Maximum 3 products reached)
          </span>
        )}
      </div>

      {/* Comparison Table / Grid */}
      {selectedProducts.length > 0 ? (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[700px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Top Product Header Cards */}
            <div className="grid grid-cols-4 bg-slate-50 divide-x divide-slate-200 border-b border-slate-200">
              <div className="p-4 flex items-center font-bold text-xs uppercase tracking-wider text-slate-500">
                Product Details
              </div>

              {selectedProducts.map(product => (
                <div key={product.productId} className="p-4 space-y-3 relative">
                  <button
                    onClick={() => handleRemoveProduct(product.productId)}
                    className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="w-24 h-24 mx-auto bg-white rounded-xl p-2 border border-slate-100 flex items-center justify-center">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                      {product.brand}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 font-serif">
                      {product.title}
                    </h4>
                  </div>

                  <div className="text-center">
                    <div className="text-base font-black text-slate-900">
                      ₹{product.discountedPrice.toLocaleString('en-IN')}
                    </div>
                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (product.affiliateLink) window.open(product.affiliateLink, '_blank');
                      else navigate(`/product/${product.slug || product.productId}`);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow flex items-center justify-center gap-1"
                  >
                    <span>View Deal</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Empty placeholder slots if < 3 */}
              {Array.from({ length: Math.max(0, 3 - selectedProducts.length) }).map((_, i) => (
                <div key={i} className="p-8 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">Add another product</span>
                </div>
              ))}
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-slate-100 text-xs">
              {/* Deals of the Day Rating */}
              <div className="grid grid-cols-4 divide-x divide-slate-100 p-3 bg-orange-50/30">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Editorial Score</span>
                </div>
                {selectedProducts.map(p => (
                  <div key={p.productId} className="px-3 py-1 font-black text-sm text-orange-600">
                    {p.recommendationScore} / 10
                  </div>
                ))}
              </div>

              {/* Recommendation Label */}
              <div className="grid grid-cols-4 divide-x divide-slate-100 p-3">
                <div className="font-semibold text-slate-500">Badge</div>
                {selectedProducts.map(p => (
                  <div key={p.productId} className="px-3 py-1 font-bold text-slate-800">
                    {p.recommendationLabel || (p.isFeatured ? "Editor's Choice" : 'Recommended')}
                  </div>
                ))}
              </div>

              {/* Best For */}
              <div className="grid grid-cols-4 divide-x divide-slate-100 p-3">
                <div className="font-semibold text-slate-500">Best For</div>
                {selectedProducts.map(p => (
                  <div key={p.productId} className="px-3 py-1 text-slate-700">
                    {p.bestFor || 'Everyday general computing and entertainment'}
                  </div>
                ))}
              </div>

              {/* Store */}
              <div className="grid grid-cols-4 divide-x divide-slate-100 p-3">
                <div className="font-semibold text-slate-500">Retailer</div>
                {selectedProducts.map(p => (
                  <div key={p.productId} className="px-3 py-1 text-slate-800 font-medium">
                    {p.store || 'Amazon'}
                  </div>
                ))}
              </div>

              {/* Pros */}
              <div className="grid grid-cols-4 divide-x divide-slate-100 p-3 bg-emerald-50/20">
                <div className="font-semibold text-emerald-900">Key Pros</div>
                {selectedProducts.map(p => (
                  <div key={p.productId} className="px-3 py-1 space-y-1 text-slate-700">
                    {p.pros && p.pros.length > 0 ? (
                      p.pros.slice(0, 3).map((pro, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </div>
                      ))
                    ) : (
                      <span>Tested hardware reliability</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Cons */}
              <div className="grid grid-cols-4 divide-x divide-slate-100 p-3 bg-rose-50/20">
                <div className="font-semibold text-rose-900">Key Cons</div>
                {selectedProducts.map(p => (
                  <div key={p.productId} className="px-3 py-1 space-y-1 text-slate-700">
                    {p.cons && p.cons.length > 0 ? (
                      p.cons.slice(0, 2).map((con, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <X className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </div>
                      ))
                    ) : (
                      <span>Standard tier considerations</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Specifications rows */}
              {allSpecKeys.map(specKey => (
                <div key={specKey} className="grid grid-cols-4 divide-x divide-slate-100 p-3">
                  <div className="font-semibold text-slate-500">{specKey}</div>
                  {selectedProducts.map(p => (
                    <div key={p.productId} className="px-3 py-1 text-slate-800">
                      {p.specifications?.[specKey] || '—'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <p className="text-sm font-medium text-slate-600">
            No products selected for comparison. Choose products from the dropdown above.
          </p>
        </div>
      )}
    </div>
  );
};
