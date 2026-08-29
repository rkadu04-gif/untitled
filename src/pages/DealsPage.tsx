import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { DealCard } from '../components/ui/DealCard';
import { ProductCard } from '../components/ui/ProductCard';
import {
  Tag,
  Filter,
  Flame,
  TrendingUp,
  LayoutGrid,
  List,
  Sparkles
} from 'lucide-react';

interface DealsPageProps {
  navigate: (path: string) => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ navigate }) => {
  const { products, categories } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStore, setSelectedStore] = useState<string>('ALL');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [onlyTrending, setOnlyTrending] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('discount');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Stores
  const stores = useMemo(() => {
    const s = new Set<string>();
    products.forEach(p => { if (p.store) s.add(p.store); });
    return Array.from(s);
  }, [products]);

  // Filtered & Sorted Deals
  const deals = useMemo(() => {
    let list = products.filter(p => p.active && p.published && (p.discountPercentage || 0) >= minDiscount);

    if (selectedCategory !== 'ALL') {
      list = list.filter(p => p.categoryId.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedStore !== 'ALL') {
      list = list.filter(p => (p.store || '').toLowerCase() === selectedStore.toLowerCase());
    }

    if (onlyTrending) {
      list = list.filter(p => p.isTrending);
    }

    if (sortBy === 'discount') {
      list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    } else if (sortBy === 'recommended') {
      list.sort((a, b) => b.recommendationScore - a.recommendationScore);
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.discountedPrice - a.discountedPrice);
    }

    return list;
  }, [products, selectedCategory, selectedStore, minDiscount, onlyTrending, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="Today's Best Tech Deals & Price Drops in India"
        description="Browse verified discounts, lightning deals, and price drops on smartphones, laptops, headphones, and gadgets in India."
        canonicalUrl="/deals"
      />

      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>Price Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white">
            Today's Best Verified Deals
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal">
            Every deal listed below is cross-checked against genuine retail prices and backed by our editorial recommendation standards.
          </p>
        </div>

        <div className="text-right shrink-0 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
          <span className="text-2xl sm:text-3xl font-black text-indigo-400 block">{deals.length}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Price Drops</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Categories</option>
              {categories.filter(c => c.active).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Store Filter */}
            {stores.length > 0 && (
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Stores</option>
                {stores.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}

            {/* Minimum Discount Filter */}
            <select
              value={minDiscount}
              onChange={(e) => setMinDiscount(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={0}>Any Discount</option>
              <option value={5}>5%+ OFF</option>
              <option value={10}>10%+ OFF</option>
              <option value={15}>15%+ OFF</option>
              <option value={20}>20%+ OFF</option>
            </select>

            {/* Trending Toggle */}
            <button
              onClick={() => setOnlyTrending(!onlyTrending)}
              className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
                onlyTrending
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Only</span>
            </button>
          </div>

          {/* Right side: Sort and View Mode */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="discount">Highest Discount</option>
                <option value="recommended">Top Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'bg-white text-slate-400'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'bg-white text-slate-400'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deals List / Grid */}
      {deals.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-3">
            {deals.map(product => (
              <DealCard
                key={product.productId}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map(product => (
              <ProductCard
                key={product.productId}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center space-y-3 shadow-sm">
          <p className="text-sm font-medium text-slate-600">
            No deals found matching your selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedStore('ALL');
              setMinDiscount(0);
              setOnlyTrending(false);
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
