import React from 'react';
import { Category } from '../../types';
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  BatteryCharging,
  Monitor,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  productCount: number;
  navigate: (path: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  productCount,
  navigate
}) => {
  const getIcon = (id: string) => {
    switch (id.toLowerCase()) {
      case 'smartphones':
        return <Smartphone className="w-6 h-6 text-orange-600" />;
      case 'laptops':
        return <Laptop className="w-6 h-6 text-blue-600" />;
      case 'earbuds':
        return <Headphones className="w-6 h-6 text-emerald-600" />;
      case 'smartwatches':
        return <Watch className="w-6 h-6 text-purple-600" />;
      case 'powerbanks':
        return <BatteryCharging className="w-6 h-6 text-amber-600" />;
      case 'monitors':
        return <Monitor className="w-6 h-6 text-indigo-600" />;
      default:
        return <Layers className="w-6 h-6 text-slate-600" />;
    }
  };

  const getBgGlow = (id: string) => {
    switch (id.toLowerCase()) {
      case 'smartphones': return 'bg-orange-50/80 border-orange-100 group-hover:border-orange-300';
      case 'laptops': return 'bg-blue-50/80 border-blue-100 group-hover:border-blue-300';
      case 'earbuds': return 'bg-emerald-50/80 border-emerald-100 group-hover:border-emerald-300';
      case 'smartwatches': return 'bg-purple-50/80 border-purple-100 group-hover:border-purple-300';
      case 'powerbanks': return 'bg-amber-50/80 border-amber-100 group-hover:border-amber-300';
      case 'monitors': return 'bg-indigo-50/80 border-indigo-100 group-hover:border-indigo-300';
      default: return 'bg-slate-50 border-slate-200 group-hover:border-slate-300';
    }
  };

  return (
    <div
      onClick={() => navigate(`/best/${category.slug || category.id}`)}
      className="group relative bg-white rounded-xl border border-slate-200 p-5 transition-all duration-200 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-indigo-300 shadow-sm"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
            {getIcon(category.id)}
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
            {productCount} {productCount === 1 ? 'Pick' : 'Picks'}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
          Best {category.name}
        </h3>

        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>See Recommendations</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
