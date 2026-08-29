import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { ProductCard } from '../components/ui/ProductCard';
import {
  Sparkles,
  ExternalLink,
  Check,
  X,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Share2,
  Calendar,
  Store,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, navigate }) => {
  const { getProductBySlug, getProductsByCategory, categories, buyingGuides, settings } = useApp();
  const product = getProductBySlug(slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">Product Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested product does not exist or has been unpublished.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id.toLowerCase() === product.categoryId.toLowerCase());
  const categoryName = category ? category.name : product.categoryId;

  // Images gallery
  const gallery = product.imageGallery && product.imageGallery.length > 0
    ? product.imageGallery
    : [product.imageUrl];

  const currentImage = gallery[activeImageIndex] || product.imageUrl;

  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.discountedPrice);
  const formattedOriginalPrice = product.originalPrice > product.discountedPrice
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.originalPrice)
    : null;

  // Related products from same category
  const relatedProducts = getProductsByCategory(product.categoryId)
    .filter(p => p.productId !== product.productId)
    .slice(0, 3);

  // Related buying guide
  const relatedGuide = buyingGuides.find(g => g.categoryId.toLowerCase() === product.categoryId.toLowerCase() && g.published);

  const handleAffiliateClick = () => {
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on Deals of the Day`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Schema.org Product Structured Data
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: gallery,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Generic'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.discountedPrice,
      availability: product.availability === 'Out of Stock'
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      url: product.affiliateLink || `${settings.siteUrl}/product/${product.slug || product.productId}`,
      seller: {
        '@type': 'Organization',
        name: product.store || 'Amazon'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.recommendationScore,
      bestRating: '10',
      worstRating: '1',
      ratingCount: '1'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SEOHead
        title={product.seoTitle || `${product.title} Review & Best Deals`}
        description={product.metaDescription || product.description}
        canonicalUrl={`/product/${product.slug || product.productId}`}
        ogImage={product.imageUrl}
        ogType="product"
        schema={productSchema}
      />

      {/* Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="hover:text-indigo-600">Home</button>
          <span>/</span>
          <button onClick={() => navigate(`/category/${product.categoryId}`)} className="hover:text-indigo-600">
            {categoryName}
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold line-clamp-1 max-w-[200px] sm:max-w-md">
            {product.title}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Top Main Section: Gallery + Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square bg-slate-50/80 rounded-2xl p-6 border border-slate-200 flex items-center justify-center overflow-hidden">
            {product.recommendationLabel && (
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md bg-indigo-600 text-white text-xs font-bold shadow flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{product.recommendationLabel}</span>
              </div>
            )}

            <img
              src={currentImage}
              alt={product.title}
              loading="eager"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain mix-blend-multiply transition-all"
            />
          </div>

          {/* Thumbnail Strip if multiple images */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl bg-slate-50 border p-1.5 flex items-center justify-center shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Score, Pricing, CTA (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                {product.brand} {product.model ? `• ${product.model}` : ''}
              </span>
              <span className="text-xs text-slate-400">
                Category: <strong className="text-slate-700">{categoryName}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Deals of the Day Rating Score Bar */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow">
                {product.recommendationScore}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
                  Deals of the Day Rating
                </span>
                <span className="text-xs text-slate-300">
                  Based on hardware benchmarks, build quality, and verified user tests.
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Current Verified Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-900">{formattedPrice}</span>
                  {formattedOriginalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {formattedOriginalPrice}
                    </span>
                  )}
                </div>
              </div>

              {product.discountPercentage && product.discountPercentage > 0 && (
                <div className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-xs">
                  {product.discountPercentage}% OFF Deal
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 pt-3">
              <span className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-slate-400" />
                <span>Retailer: <strong className="text-slate-800">{product.store || 'Amazon India'}</strong></span>
              </span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> {product.availability || 'In Stock'}
              </span>
            </div>

            {/* View Deal Affiliate Action Button */}
            <button
              id="product-buy-now-btn"
              onClick={handleAffiliateClick}
              className="w-full py-3.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>View Deal / Buy Now on {product.store || 'Amazon'}</span>
              <ExternalLink className="w-5 h-5" />
            </button>

            {/* Affiliate Disclaimer Note */}
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Prices and availability may change. We may earn a commission if you purchase through links on this page.
            </p>
          </div>

          {/* Best For Callout */}
          {product.bestFor && (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
              <Zap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">
                  Best For
                </span>
                <span className="text-sm font-medium text-indigo-900">
                  {product.bestFor}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editorial Breakdown: Description, Pros, Cons, Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-slate-200">
        {/* Left Column: Why We Recommend It & Features (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Why We Recommend It */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Why We Recommend It</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              {product.description}
            </p>
          </div>

          {/* Key Features Bullets */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">
                Key Highlights & Features
              </h3>
              <ul className="space-y-2.5">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pros */}
            <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200/70 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Pros (Reasons to Buy)</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {product.pros && product.pros.length > 0 ? (
                  product.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))
                ) : (
                  <li>Excellent performance and reliability</li>
                )}
              </ul>
            </div>

            {/* Cons */}
            <div className="bg-rose-50/60 rounded-xl p-5 border border-rose-200/70 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <X className="w-4 h-4 text-rose-600" />
                <span>Cons (Things to Consider)</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {product.cons && product.cons.length > 0 ? (
                  product.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))
                ) : (
                  <li>Premium price point</li>
                )}
              </ul>
            </div>
          </div>

          {/* Editorial Verdict */}
          {product.verdict && (
            <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-2 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Deals of the Day Verdict
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
                "{product.verdict}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Full Specifications Table (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 font-bold text-slate-900 text-sm">
              Technical Specifications
            </div>

            <div className="divide-y divide-slate-100">
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="px-5 py-3 flex justify-between gap-4 text-xs">
                    <span className="text-slate-500 font-semibold">{key}</span>
                    <span className="text-slate-900 font-medium text-right">{val}</span>
                  </div>
                ))
              ) : (
                <div className="p-5 text-xs text-slate-400 italic">
                  Standard manufacturer specifications apply.
                </div>
              )}
            </div>
          </div>

          {/* Related Buying Guide Banner */}
          {relatedGuide && (
            <div
              onClick={() => navigate(`/guides/${relatedGuide.slug || relatedGuide.id}`)}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Related Buying Guide</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {relatedGuide.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {relatedGuide.introduction}
              </p>
              <div className="mt-3 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              Similar {categoryName} You Might Like
            </h3>
            <button
              onClick={() => navigate(`/best/${product.categoryId}`)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              See all Best {categoryName} &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.productId}
                product={p}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
