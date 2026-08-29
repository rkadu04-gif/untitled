import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { ProductCard } from '../components/ui/ProductCard';
import {
  Sparkles,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Layers
} from 'lucide-react';

interface CategoryPageProps {
  categoryId: string;
  navigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId, navigate }) => {
  const { categories, getProductsByCategory, settings } = useApp();
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [priceRange, setPriceRange] = useState<string>('ALL');

  const category = categories.find(c => c.id.toLowerCase() === categoryId.toLowerCase() || c.slug.toLowerCase() === categoryId.toLowerCase());
  const categoryName = category ? category.name : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  const rawProducts = getProductsByCategory(category?.id || categoryId);

  // Extract unique brands
  const brands = useMemo(() => {
    const bSet = new Set<string>();
    rawProducts.forEach(p => { if (p.brand) bSet.add(p.brand); });
    return Array.from(bSet);
  }, [rawProducts]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    if (selectedBrand !== 'ALL') {
      list = list.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (priceRange === 'UNDER_20K') {
      list = list.filter(p => p.discountedPrice < 20000);
    } else if (priceRange === '20K_TO_50K') {
      list = list.filter(p => p.discountedPrice >= 20000 && p.discountedPrice <= 50000);
    } else if (priceRange === 'ABOVE_50K') {
      list = list.filter(p => p.discountedPrice > 50000);
    }

    if (sortBy === 'recommended') {
      list.sort((a, b) => b.recommendationScore - a.recommendationScore);
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.discountedPrice - a.discountedPrice);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    }

    return list;
  }, [rawProducts, selectedBrand, priceRange, sortBy]);

  const pageTitle = category?.seoTitle || `${categoryName} Products, Reviews & Deals | Deals of the Day`;
  const pageDesc = category?.metaDescription || `Browse verified deals and editorial recommendations for ${categoryName.toLowerCase()} in India.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title={pageTitle}
        description={pageDesc}
        canonicalUrl={`/category/${categoryId}`}
      />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <button onClick={() => navigate('/')} className="hover:text-orange-600">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/categories')} className="hover:text-orange-600">Categories</button>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{categoryName}</span>
      </div>

      {/* Category Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Category Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            {categoryName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {category?.description || `Explore our tested ${categoryName.toLowerCase()} recommendations and verified live deal prices.`}
          </p>
        </div>

        {/* Big Editorial Rankings Banner Button */}
        <button
          onClick={() => navigate(`/best/${category?.id || categoryId}`)}
          className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow transition-all hover:scale-105 flex items-center gap-2 shrink-0 group border border-slate-800"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>See Best {categoryName} Ranked</span>
          <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Filter & Sorting Controls */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="ALL">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          )}

          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="ALL">All Price Ranges</option>
            <option value="UNDER_20K">Under ₹20,000</option>
            <option value="20K_TO_50K">₹20,000 – ₹50,000</option>
            <option value="ABOVE_50K">Above ₹50,000</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="recommended">Highest Recommended</option>
            <option value="discount">Highest Discount</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              navigate={navigate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <p className="text-sm font-medium text-slate-600">
            No products match the selected filters.
          </p>
          <button
            onClick={() => { setSelectedBrand('ALL'); setPriceRange('ALL'); }}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
