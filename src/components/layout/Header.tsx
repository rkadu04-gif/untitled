import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Send,
  Menu,
  X,
  Sparkles,
  Layers,
  Tag,
  BookOpen,
  ArrowRightLeft,
  ChevronDown,
  ShieldCheck,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  BatteryCharging,
  Monitor
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { settings, categories, searchQuery, setSearchQuery } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bestDropdownOpen, setBestDropdownOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const telegramUrl = settings?.telegramUrl || 'https://t.me/dealsoftheday004';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
      setShowSearchModal(false);
      setMobileMenuOpen(false);
    }
  };

  const activeCategories = categories.filter(c => c.active).slice(0, 8);

  const getCategoryIcon = (id: string) => {
    switch (id.toLowerCase()) {
      case 'smartphones': return <Smartphone className="w-4 h-4 text-indigo-600" />;
      case 'laptops': return <Laptop className="w-4 h-4 text-blue-600" />;
      case 'earbuds': return <Headphones className="w-4 h-4 text-emerald-600" />;
      case 'smartwatches': return <Watch className="w-4 h-4 text-purple-600" />;
      case 'powerbanks': return <BatteryCharging className="w-4 h-4 text-amber-600" />;
      case 'monitors': return <Monitor className="w-4 h-4 text-indigo-500" />;
      default: return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Announcement Bar if enabled */}
      {settings?.showAnnouncement && settings.headerAnnouncement && (
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>{settings.headerAnnouncement}</span>
          <span className="hidden md:inline-block text-slate-400">•</span>
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Editorial Independence
          </span>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              id="header-logo-btn"
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group text-left focus:outline-none"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-800 block leading-tight">
                  DEALS <span className="text-indigo-600 font-semibold">OF THE DAY</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                  Product Intelligence
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700">
            {/* Best Picks with Dropdown */}
            <div className="relative" onMouseLeave={() => setBestDropdownOpen(false)}>
              <button
                id="nav-best-picks-btn"
                onClick={() => setBestDropdownOpen(!bestDropdownOpen)}
                onMouseEnter={() => setBestDropdownOpen(true)}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors hover:text-indigo-600 hover:bg-slate-100 ${
                  currentPath.startsWith('/best') ? 'text-indigo-600 font-semibold bg-indigo-50/80' : ''
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Best Picks</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {bestDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Ranked Best Lists
                  </div>
                  {activeCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigate(`/best/${cat.id}`);
                        setBestDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors"
                    >
                      {getCategoryIcon(cat.id)}
                      <span>Best {cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Deals */}
            <button
              id="nav-deals-btn"
              onClick={() => navigate('/deals')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors hover:text-indigo-600 hover:bg-slate-100 ${
                currentPath === '/deals' ? 'text-indigo-600 font-semibold bg-indigo-50/80' : ''
              }`}
            >
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>Deals</span>
            </button>

            {/* Categories */}
            <button
              id="nav-categories-btn"
              onClick={() => navigate('/categories')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors hover:text-indigo-600 hover:bg-slate-100 ${
                currentPath.startsWith('/category') || currentPath === '/categories' ? 'text-indigo-600 font-semibold bg-indigo-50/80' : ''
              }`}
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Categories</span>
            </button>

            {/* Buying Guides */}
            <button
              id="nav-guides-btn"
              onClick={() => navigate('/guides')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors hover:text-indigo-600 hover:bg-slate-100 ${
                currentPath.startsWith('/guides') ? 'text-indigo-600 font-semibold bg-indigo-50/80' : ''
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Buying Guides</span>
            </button>

            {/* Compare */}
            <button
              id="nav-compare-btn"
              onClick={() => navigate('/compare')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors hover:text-indigo-600 hover:bg-slate-100 ${
                currentPath === '/compare' ? 'text-indigo-600 font-semibold bg-indigo-50/80' : ''
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-slate-500" />
              <span>Compare</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Pill Input Trigger */}
            <button
              id="header-search-trigger"
              onClick={() => setShowSearchModal(true)}
              className="bg-slate-100 hover:bg-slate-200/70 border border-slate-200/70 rounded-full py-1.5 px-3.5 text-xs text-slate-600 transition-colors flex items-center gap-2"
              title="Search products"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline text-slate-400">Search products...</span>
            </button>

            {/* Join Telegram Button */}
            <a
              id="header-join-telegram-btn"
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Join Telegram</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search smartphones, laptops, earbuds..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => { navigate('/deals'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-sm text-left border border-indigo-100"
            >
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>Today's Deals</span>
            </button>
            <button
              onClick={() => { navigate('/compare'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 text-slate-800 font-medium text-sm text-left border border-slate-200"
            >
              <ArrowRightLeft className="w-4 h-4 text-slate-600" />
              <span>Compare Specs</span>
            </button>
          </div>

          <div className="pt-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Best Picks by Category
            </div>
            <div className="space-y-1">
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { navigate(`/best/${cat.id}`); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2 px-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {getCategoryIcon(cat.id)}
                    <span>Best {cat.name}</span>
                  </span>
                  <span className="text-xs text-indigo-600 font-medium">Rankings &rarr;</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <button
              onClick={() => { navigate('/categories'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              All Categories
            </button>
            <button
              onClick={() => { navigate('/guides'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Buying Guides
            </button>
            <button
              onClick={() => { navigate('/affiliate-disclosure'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-2.5 text-xs text-slate-500 hover:text-slate-800"
            >
              Affiliate Disclosure
            </button>
            <button
              onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-2.5 text-xs text-slate-400 hover:text-slate-700"
            >
              Admin Portal
            </button>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <form onSubmit={handleSearchSubmit} className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search products by title, brand, model (e.g. iQOO 15, MacBook, S25)..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full text-base text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            <div className="p-4 bg-slate-50/70 text-xs text-slate-500 flex items-center justify-between">
              <span className="font-semibold text-slate-600">Popular:</span>
              <div className="flex gap-2 flex-wrap">
                {['iQOO 15', 'MacBook Air', 'Galaxy S25 Ultra', 'Sony XM5', 'Anker 737'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/search?q=${encodeURIComponent(term)}`);
                      setShowSearchModal(false);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-slate-700 text-xs font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
