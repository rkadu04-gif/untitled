import React from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/layout/SEOHead';
import { CategoryCard } from '../components/ui/CategoryCard';
import { Layers } from 'lucide-react';

interface CategoriesPageProps {
  navigate: (path: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ navigate }) => {
  const { categories, products } = useApp();

  const activeCategories = categories.filter(c => c.active);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="Product Categories & Best Tech Rankings"
        description="Explore curated product categories including smartphones, laptops, audio gear, smartwatches, power banks, and monitors."
        canonicalUrl="/categories"
      />

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>All Categories</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
          Browse by Category
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Find top recommendations, buying guides, and verified deals organized by department.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCategories.map((category) => {
          const count = products.filter(p => p.active && p.published && p.categoryId.toLowerCase() === category.id.toLowerCase()).length;
          return (
            <CategoryCard
              key={category.id}
              category={category}
              productCount={count}
              navigate={navigate}
            />
          );
        })}
      </div>
    </div>
  );
};
