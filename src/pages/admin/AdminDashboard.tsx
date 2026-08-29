import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Category, BuyingGuide, SiteSettings } from '../../types';
import {
  parseProductsExcelOrCsv,
  generateSampleTemplateCsv,
  downloadCsvFile
} from '../../services/excelService';
import {
  Sparkles,
  Package,
  Layers,
  BookOpen,
  Settings,
  UploadCloud,
  Download,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  FileSpreadsheet,
  TrendingUp,
  Tag,
  Save,
  X,
  Database,
  LogOut
} from 'lucide-react';
import { auth } from '../../services/firebase';

import { BuyingGuideModal } from '../../components/admin/BuyingGuideModal';

interface AdminDashboardProps {
  navigate: (path: string) => void;
  tab?: 'products' | 'import' | 'categories' | 'guides' | 'settings';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate, tab }) => {
  const {
    products,
    categories,
    buyingGuides,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkImportProducts,
    addCategory,
    updateCategory,
    deleteCategory,
    addBuyingGuide,
    updateBuyingGuide,
    deleteBuyingGuide,
    updateSettings,
    resetToSeedData,
    isFirebaseSyncing
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'import' | 'categories' | 'guides' | 'settings'>(tab || 'products');

  React.useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  // Search & Filter within admin products
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('ALL');

  // Product Modal / Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Category Form State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Guide Form State
  const [editingGuide, setEditingGuide] = useState<BuyingGuide | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Excel Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importedProductsPreview, setImportedProductsPreview] = useState<Partial<Product>[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings local state
  const [localSettings, setLocalSettings] = useState<SiteSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ----------------------------------------------------
  // PRODUCT MODAL HANDLERS
  // ----------------------------------------------------
  const handleOpenNewProduct = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      productId: `prod-${Date.now()}`,
      slug: '',
      title: '',
      brand: '',
      model: '',
      categoryId: categories[0]?.id || 'smartphones',
      description: '',
      bestFor: '',
      originalPrice: 0,
      discountedPrice: 0,
      discountPercentage: 0,
      affiliateLink: '',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      imageGallery: [],
      store: 'Amazon',
      availability: 'In Stock',
      recommendationScore: 9.0,
      recommendationLabel: "Editor's Choice",
      featured: false,
      trending: false,
      active: true,
      published: true,
      features: ['High-performance processor', 'Crisp OLED display', 'Fast charging support'],
      pros: ['Exceptional performance', 'Clean software experience'],
      cons: ['No headphone jack'],
      specifications: {
        Processor: 'Octa-Core flagship',
        Display: '6.7-inch OLED 120Hz',
        Camera: '50MP Primary + 12MP Ultra-Wide',
        Battery: '5000 mAh with Fast Charging'
      },
      bestRankings: [{
        categorySlug: categories[0]?.id || 'smartphones',
        rank: 1,
        label: "Editor's Choice",
        reason: 'Best overall choice in its segment.'
      }]
    };
    setEditingProduct(newProd);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Auto-calculate discount percentage if not manually overridden
    const orig = Number(editingProduct.originalPrice) || 0;
    const disc = Number(editingProduct.discountedPrice) || 0;
    let calcDiscount = editingProduct.discountPercentage;
    if (orig > disc && disc > 0) {
      calcDiscount = Math.round(((orig - disc) / orig) * 100);
    }

    // Auto-generate slug if empty
    const slug = editingProduct.slug || editingProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const finalProduct: Product = {
      ...editingProduct,
      slug,
      originalPrice: orig,
      discountedPrice: disc,
      discountPercentage: calcDiscount,
      recommendationScore: Number(editingProduct.recommendationScore) || 9.0
    };

    const exists = products.some(p => p.productId === finalProduct.productId);
    if (exists) {
      await updateProduct(finalProduct);
    } else {
      await addProduct(finalProduct);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // ----------------------------------------------------
  // EXCEL IMPORT HANDLERS
  // ----------------------------------------------------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportSuccessMsg(null);
    const result = await parseProductsExcelOrCsv(file);
    setImportedProductsPreview(result.products);
    setImportErrors(result.errors);
  };

  const handleExecuteImport = async () => {
    if (importedProductsPreview.length === 0) return;

    // Convert partials to full products
    const validProducts: Product[] = importedProductsPreview.map((p, idx) => ({
      productId: p.productId || `prod-imp-${Date.now()}-${idx}`,
      slug: p.slug || (p.title || `product-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: p.title || 'Untitled Product',
      brand: p.brand || 'Generic',
      model: p.model || '',
      categoryId: p.categoryId || 'smartphones',
      description: p.description || '',
      bestFor: p.bestFor || '',
      originalPrice: Number(p.originalPrice) || 0,
      discountedPrice: Number(p.discountedPrice) || 0,
      discountPercentage: Number(p.discountPercentage) || 0,
      affiliateLink: p.affiliateLink || '',
      imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      imageGallery: p.imageGallery || [],
      store: p.store || 'Amazon',
      availability: p.availability || 'In Stock',
      recommendationScore: Number(p.recommendationScore) || 9.0,
      recommendationLabel: p.recommendationLabel || "Editor's Choice",
      featured: p.featured ?? false,
      trending: p.trending ?? false,
      active: p.active ?? true,
      published: p.published ?? true,
      features: p.features || [],
      pros: p.pros || [],
      cons: p.cons || [],
      specifications: p.specifications || {},
      bestRankings: p.bestRankings || []
    }));

    await bulkImportProducts(validProducts, importMode === 'replace');
    setImportSuccessMsg(`Successfully imported ${validProducts.length} products into Deals of the Day catalog!`);
    setImportedProductsPreview([]);
    setImportFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadTemplate = () => {
    const csv = generateSampleTemplateCsv();
    downloadCsvFile('deals_of_the_day_products_template.csv', csv);
  };

  // ----------------------------------------------------
  // SETTINGS HANDLER
  // ----------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(localSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Filtered admin products list
  const filteredAdminProducts = products.filter(p => {
    const matchesCat = adminCategoryFilter === 'ALL' || p.categoryId.toLowerCase() === adminCategoryFilter.toLowerCase();
    const matchesSearch = !adminSearch || p.title.toLowerCase().includes(adminSearch.toLowerCase()) || p.brand.toLowerCase().includes(adminSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Editorial Administration & CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Deals of the Day Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Manage product catalog, Excel bulk imports, category rankings, and SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isFirebaseSyncing && (
            <span className="flex items-center gap-1.5 text-xs text-orange-400 font-medium bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Syncing Cloud...</span>
            </span>
          )}
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>
          <button
            onClick={() => {
              auth?.signOut().then(() => navigate('/admin/login'));
            }}
            className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold transition-all border border-rose-500/30 hover:border-rose-600 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Products</div>
          <div className="text-2xl font-bold text-slate-900">{products.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Categories</div>
          <div className="text-2xl font-bold text-slate-900">{categories.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Guides</div>
          <div className="text-2xl font-bold text-slate-900">{buyingGuides.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Featured</div>
          <div className="text-2xl font-bold text-orange-600">{products.filter(p => p.featured).length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Trending</div>
          <div className="text-2xl font-bold text-orange-600">{products.filter(p => p.trending).length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">Best Picks</div>
          <div className="text-2xl font-bold text-orange-600">{products.filter(p => p.bestPick).length}</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'products' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'import' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Excel / CSV Bulk Import</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'categories' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guides')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'guides' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Buying Guides ({buyingGuides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'settings' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Site Settings</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Filter products by title or brand..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <select
                value={adminCategoryFilter}
                onChange={(e) => setAdminCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenNewProduct}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Single Product</span>
              </button>

              <button
                onClick={() => setActiveTab('import')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Bulk Excel Import</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Live Price</th>
                    <th className="p-3.5">Score</th>
                    <th className="p-3.5">Rank in Category</th>
                    <th className="p-3.5">Flags</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAdminProducts.map((p) => {
                    const topRank = p.bestRankings?.[0];
                    return (
                      <tr key={p.productId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt=""
                              className="w-10 h-10 object-contain rounded bg-slate-50 p-1 border border-slate-100 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block line-clamp-1 max-w-xs font-serif">
                                {p.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {p.brand} • {p.store || 'Amazon'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            {p.categoryId}
                          </span>
                        </td>

                        <td className="p-3.5 font-bold text-slate-900">
                          ₹{p.discountedPrice.toLocaleString('en-IN')}
                          {p.discountPercentage && p.discountPercentage > 0 ? (
                            <span className="ml-1 text-[10px] font-bold text-emerald-600">
                              ({p.discountPercentage}% OFF)
                            </span>
                          ) : null}
                        </td>

                        <td className="p-3.5">
                          <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                            {p.recommendationScore}
                          </span>
                        </td>

                        <td className="p-3.5">
                          {topRank ? (
                            <span className="text-xs font-bold text-slate-900">
                              #{topRank.rank} <span className="text-[10px] text-orange-600">({topRank.label})</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Unranked</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1">
                            {p.featured && (
                              <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold">
                                Featured
                              </span>
                            )}
                            {p.trending && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Deal
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditProduct(p)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-orange-600"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete product "${p.title}"?`)) {
                                  deleteProduct(p.productId);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: EXCEL / CSV BULK IMPORT */}
      {/* ============================================================ */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Bulk Product Excel / CSV Importer
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload multiple product recommendations and ranked lists at once using CSV or Excel.
                </p>
              </div>

              <button
                onClick={handleDownloadTemplate}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Download Sample Excel / CSV Template</span>
              </button>
            </div>

            {/* Drag and drop upload zone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl p-8 text-center space-y-3 bg-slate-50 transition-colors">
              <UploadCloud className="w-10 h-10 text-orange-500 mx-auto" />
              <div>
                <label className="cursor-pointer text-sm font-bold text-orange-600 hover:text-orange-700">
                  <span>Click to select an Excel / CSV file</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  Supports .csv and .xlsx files. Columns include Title, Category, Discounted Price, Affiliate Link, Best Ranking, Pros, Cons, and Specs.
                </p>
              </div>

              {importFile && (
                <div className="inline-block px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700">
                  Selected: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            {/* Success or Error Messages */}
            {importSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importSuccessMsg}</span>
              </div>
            )}

            {importErrors.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Validation Warnings:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                  {importErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview Section */}
            {importedProductsPreview.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    Preview: {importedProductsPreview.length} Products Ready to Import
                  </h4>

                  <div className="flex items-center gap-4">
                    <label className="text-xs text-slate-600 flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                        className="text-orange-600"
                      />
                      <span>Append / Update</span>
                    </label>
                    <label className="text-xs text-slate-600 flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="text-orange-600"
                      />
                      <span className="text-rose-600 font-semibold">Replace All Existing</span>
                    </label>

                    <button
                      onClick={handleExecuteImport}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Confirm & Import to Catalog</span>
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="p-2.5">Title</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Price (INR)</th>
                        <th className="p-2.5">Score</th>
                        <th className="p-2.5">Ranking</th>
                        <th className="p-2.5">Affiliate Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {importedProductsPreview.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-900 max-w-xs truncate">{p.title}</td>
                          <td className="p-2.5 uppercase text-[10px] font-bold">{p.categoryId}</td>
                          <td className="p-2.5">₹{p.discountedPrice?.toLocaleString('en-IN')}</td>
                          <td className="p-2.5 font-bold text-orange-600">{p.recommendationScore}</td>
                          <td className="p-2.5">
                            {p.bestRankings?.[0] ? `#${p.bestRankings[0].rank} ${p.bestRankings[0].label}` : '—'}
                          </td>
                          <td className="p-2.5 text-slate-400 font-mono text-[10px] max-w-[150px] truncate">
                            {p.affiliateLink || 'None'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Categories</h3>
            <button
              onClick={() => {
                const newCat: Category = {
                  id: `cat-${Date.now()}`,
                  name: '',
                  slug: '',
                  description: '',
                  icon: 'Layers',
                  active: true,
                  seoTitle: '',
                  metaDescription: '',
                  sortOrder: categories.length + 1
                };
                setEditingCategory(newCat);
                setIsCategoryModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm font-serif">{cat.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }}
                      className="p-1 text-slate-500 hover:text-orange-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${cat.name}"?`)) deleteCategory(cat.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>
                <div className="text-[10px] font-mono text-slate-400">
                  Slug: /best/{cat.slug || cat.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: BUYING GUIDES MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Buying Guides</h3>
            <button
              onClick={() => {
                const newGuide: BuyingGuide = {
                  id: `guide-${Date.now()}`,
                  slug: '',
                  title: '',
                  categoryId: categories[0]?.id || 'smartphones',
                  introduction: '',
                  verdictSummary: '',
                  published: true,
                  updatedAt: new Date().toISOString(),
                  products: []
                };
                setEditingGuide(newGuide);
                setIsGuideModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Buying Guide</span>
            </button>
          </div>

          <div className="space-y-4">
            {buyingGuides.map((guide) => (
              <div key={guide.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-800">
                      {guide.categoryId}
                    </span>
                    <span className="text-xs text-slate-400">
                      {guide.products.length} ranked products
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">{guide.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{guide.introduction}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setEditingGuide(guide); setIsGuideModalOpen(true); }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Edit Guide
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete guide "${guide.title}"?`)) deleteBuyingGuide(guide.id);
                    }}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: SITE SETTINGS & BACKUP */}
      {/* ============================================================ */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Global Platform Settings</h3>

            {settingsSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Settings successfully saved and synced!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Site Name</label>
                <input
                  type="text"
                  value={localSettings.siteName}
                  onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Site Production URL</label>
                <input
                  type="text"
                  value={localSettings.siteUrl}
                  onChange={(e) => setLocalSettings({ ...localSettings, siteUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Telegram Channel URL</label>
                <input
                  type="text"
                  value={localSettings.telegramUrl}
                  onChange={(e) => setLocalSettings({ ...localSettings, telegramUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={localSettings.contactEmail}
                  onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={localSettings.showAnnouncement}
                  onChange={(e) => setLocalSettings({ ...localSettings, showAnnouncement: e.target.checked })}
                  className="text-orange-600 rounded"
                />
                <span>Enable Top Header Announcement Banner</span>
              </label>

              {localSettings.showAnnouncement && (
                <input
                  type="text"
                  value={localSettings.headerAnnouncement}
                  onChange={(e) => setLocalSettings({ ...localSettings, headerAnnouncement: e.target.value })}
                  placeholder="e.g. 🔥 Prime Day & Republic Day Tech Deals Live — Updated Hourly"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900"
                />
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h4 className="text-md font-bold text-slate-900 font-serif">Homepage Settings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={localSettings.homepage?.heroTitle || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, homepage: { ...localSettings.homepage, heroTitle: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                    placeholder="India's Most Trusted Tech Deal Curation"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={localSettings.homepage?.heroSubtitle || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, homepage: { ...localSettings.homepage, heroSubtitle: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Hero Description</label>
                  <textarea
                    value={localSettings.homepage?.heroDescription || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, homepage: { ...localSettings.homepage, heroDescription: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hero Badge Text</label>
                  <input
                    type="text"
                    value={localSettings.homepage?.heroBadgeText || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, homepage: { ...localSettings.homepage, heroBadgeText: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                    placeholder="e.g. 100% Manually Verified Deals"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Explore Best Picks Button Text</label>
                  <input
                    type="text"
                    value={localSettings.homepage?.exploreBestPicksText || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, homepage: { ...localSettings.homepage, exploreBestPicksText: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Explore Best Picks Link</label>
                  <input
                    type="text"
                    value={localSettings.homepage?.exploreBestPicksLink || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, homepage: { ...localSettings.homepage, exploreBestPicksLink: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Today's Deals Button Text</label>
                  <input
                    type="text"
                    value={localSettings.homepage?.todaysDealsText || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, homepage: { ...localSettings.homepage, todaysDealsText: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Today's Deals Link</label>
                  <input
                    type="text"
                    value={localSettings.homepage?.todaysDealsLink || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, homepage: { ...localSettings.homepage, todaysDealsLink: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all shadow"
              >
                Save Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset database to initial seed demo data? Any custom added items will be replaced.')) {
                    resetToSeedData();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100"
              >
                Reset to Default Seed Data
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* PRODUCT EDIT / ADD MODAL */}
      {/* ============================================================ */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                {products.some(p => p.productId === editingProduct.productId) ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={editingProduct.store}
                    onChange={(e) => setEditingProduct({ ...editingProduct, store: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                    placeholder="Amazon, Flipkart, etc."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discounted Live Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.discountedPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountedPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Affiliate Outbound Link *</label>
                  <input
                    type="url"
                    value={editingProduct.affiliateLink}
                    onChange={(e) => setEditingProduct({ ...editingProduct, affiliateLink: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-[11px]"
                    placeholder="https://amzn.to/... or https://affiliate.flipkart.com/..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Main Image URL</label>
                  <input
                    type="url"
                    value={editingProduct.imageUrl}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Editorial Score (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={editingProduct.recommendationScore}
                    onChange={(e) => setEditingProduct({ ...editingProduct, recommendationScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recommendation Badge</label>
                  <input
                    type="text"
                    value={editingProduct.recommendationLabel}
                    onChange={(e) => setEditingProduct({ ...editingProduct, recommendationLabel: e.target.value })}
                    placeholder="Editor's Choice, Best Value, Best Premium..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>
              </div>

              {/* Best Category Ranking Setup */}
              <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200/80 space-y-3">
                <h4 className="font-bold text-orange-950 text-xs uppercase tracking-wider">
                  Best Pick Settings (Shows on /best/{editingProduct.categoryId})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold mb-2">
                      <input
                        type="checkbox"
                        checked={editingProduct.bestPick || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, bestPick: e.target.checked })}
                        className="text-orange-600"
                      />
                      <span>Is Best Pick?</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Rank Order Number</label>
                    <input
                      type="number"
                      value={editingProduct.bestPickRank || 1}
                      onChange={(e) => setEditingProduct({ ...editingProduct, bestPickRank: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold"
                      disabled={!editingProduct.bestPick}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Recommendation Badge</label>
                    <input
                      type="text"
                      value={editingProduct.bestPickBadge || "Editor's Choice"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, bestPickBadge: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5"
                      placeholder="e.g. Editor's Choice"
                      disabled={!editingProduct.bestPick}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Why We Recommend It (Editorial Snippet)</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Best For</label>
                <input
                  type="text"
                  value={editingProduct.bestFor || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, bestFor: e.target.value })}
                  placeholder="e.g. Power users who demand flagship performance and all-day battery"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pros (Separated by comma or pipe |)</label>
                <input
                  type="text"
                  value={editingProduct.pros?.join(' | ') || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, pros: e.target.value.split('|').map(s => s.trim()).filter(Boolean) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cons (Separated by comma or pipe |)</label>
                <input
                  type="text"
                  value={editingProduct.cons?.join(' | ') || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, cons: e.target.value.split('|').map(s => s.trim()).filter(Boolean) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="text-orange-600"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.trending}
                    onChange={(e) => setEditingProduct({ ...editingProduct, trending: e.target.checked })}
                    className="text-orange-600"
                  />
                  <span>Mark as Trending Deal</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Category Details</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                    slug: editingCategory.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Slug (e.g. smartphones, laptops)</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value, id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="border-t border-slate-100 pt-3 mt-3">
                <label className="flex items-center gap-2 cursor-pointer font-semibold mb-2">
                  <input
                    type="checkbox"
                    checked={editingCategory.bestPicksEnabled || false}
                    onChange={(e) => setEditingCategory({ ...editingCategory, bestPicksEnabled: e.target.checked })}
                    className="text-orange-600"
                  />
                  <span>Enable Best Picks feature for this category</span>
                </label>
                {editingCategory.bestPicksEnabled && (
                  <>
                    <div className="mt-2">
                      <label className="block font-semibold text-slate-700 mb-1">Best Picks Page Title</label>
                      <input
                        type="text"
                        value={editingCategory.bestPicksTitle || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, bestPicksTitle: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                        placeholder={`e.g. Best ${editingCategory.name}`}
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block font-semibold text-slate-700 mb-1">Best Picks Description</label>
                      <textarea
                        rows={2}
                        value={editingCategory.bestPicksDescription || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, bestPicksDescription: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (editingCategory.id) {
                    const exists = categories.some(c => c.id === editingCategory.id);
                    if (exists) await updateCategory(editingCategory);
                    else await addCategory(editingCategory);
                  }
                  setIsCategoryModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUYING GUIDE MODAL */}
      {isGuideModalOpen && editingGuide && (
        <BuyingGuideModal
          guide={editingGuide}
          categories={categories}
          onClose={() => setIsGuideModalOpen(false)}
          onSave={async (guide) => {
            const exists = buyingGuides.some(g => g.id === guide.id);
            if (exists) await updateBuyingGuide(guide);
            else await addBuyingGuide(guide);
            setIsGuideModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
