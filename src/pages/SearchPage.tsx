import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { ProductCard } from '../components/ui/ProductCard';
import { Search, Sparkles } from 'lucide-react';

interface SearchPageProps {
  navigate: (path: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ navigate }) => {
  const { searchQuery, setSearchQuery, searchProducts } = useApp();
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  useEffect(() => {
    // Check if query in URL
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      setLocalQuery(q);
      setSearchQuery(q);
    }
  }, []);

  const results = searchProducts(searchQuery || localQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title={searchQuery ? `Search results for "${searchQuery}" | Deals of the Day` : 'Search Tech Products & Recommendations'}
        description="Search for smartphones, laptops, audio gear, and verified tech discounts across Deals of the Day."
        canonicalUrl="/search"
      />

      {/* Search Input Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
          Product & Deal Search
        </h1>

        <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search by product name, category, or brand..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow"
          >
            Search
          </button>
        </form>

        <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
          <span>Popular searches:</span>
          {['iQOO 15', 'MacBook Air', 'Galaxy S25 Ultra', 'Sony XM5', 'Anker 737', 'Smartwatch'].map(term => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setLocalQuery(term);
                setSearchQuery(term);
              }}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-orange-400 border border-slate-700"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-serif">
            {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </span>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((product) => (
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
              No products found matching "{searchQuery || localQuery}".
            </p>
            <p className="text-xs text-slate-400">
              Try searching with broader terms like "phone", "laptop", or "Sony".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
