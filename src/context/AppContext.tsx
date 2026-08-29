import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, BuyingGuide, SiteSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BUYING_GUIDES } from '../data/initialSeedData';
import {
  isFirebaseConfigured,
  getFirestoreProducts,
  saveProductToFirestore,
  saveProductsBatchToFirestore,
  deleteProductFromFirestore,
  getFirestoreCategories,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  getFirestoreBuyingGuides,
  saveBuyingGuideToFirestore,
  deleteBuyingGuideFromFirestore,
  getFirestoreSiteSettings,
  saveFirestoreSiteSettings
} from '../services/firebase';

const defaultSettings: SiteSettings = {
  siteName: 'Deals of the Day',
  siteUrl: 'https://dealsofthedayonline.in',
  contactEmail: 'contact@dealsofthedayonline.in',
  telegramUrl: 'https://t.me/dealsoftheday004',
  affiliateDisclaimer: 'We may earn a commission when you buy through our links.',
  showAnnouncement: true,
  headerAnnouncement: '🔥 Independence Day Tech Deals Live — Updated Hourly!',
  homepage: {
    exploreBestPicksText: "Explore Best Picks",
    exploreBestPicksLink: "/categories",
    todaysDealsText: "Today's Best Deals",
    todaysDealsLink: "/deals"
  }
};

interface AppContextType {
  products: Product[];
  categories: Category[];
  buyingGuides: BuyingGuide[];
  settings: SiteSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  bulkImportProducts: (products: Product[], replace: boolean) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addBuyingGuide: (guide: BuyingGuide) => Promise<void>;
  updateBuyingGuide: (guide: BuyingGuide) => Promise<void>;
  deleteBuyingGuide: (guideId: string) => Promise<void>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
  resetToSeedData: () => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getBuyingGuideBySlug: (slug: string) => BuyingGuide | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  getRankedProductsForBestCategory: (categoryId: string) => { product: Product, rank: number, label: string, reason?: string }[];
  searchProducts: (query: string) => Product[];
  isFirebaseSyncing: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [buyingGuides, setBuyingGuides] = useState<BuyingGuide[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsFirebaseSyncing(true);
      try {
        if (isFirebaseConfigured) {
          const [fsProducts, fsCategories, fsGuides, fsSettings] = await Promise.all([
            getFirestoreProducts(),
            getFirestoreCategories(),
            getFirestoreBuyingGuides(),
            getFirestoreSiteSettings()
          ]);

          if (fsProducts.length > 0) setProducts(fsProducts);
          else setProducts(INITIAL_PRODUCTS);

          if (fsCategories.length > 0) setCategories(fsCategories);
          else setCategories(INITIAL_CATEGORIES);

          if (fsGuides.length > 0) setBuyingGuides(fsGuides);
          else setBuyingGuides(INITIAL_BUYING_GUIDES);

          if (fsSettings) setSettings({ ...defaultSettings, ...fsSettings });
          else {
            const savedSettings = localStorage.getItem('dod_settings');
            if (savedSettings) setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
            else setSettings(defaultSettings);
          }
        } else {
          // Fallback to local storage if Firebase is not configured
          const savedProducts = localStorage.getItem('dod_products');
          const savedCategories = localStorage.getItem('dod_categories');
          const savedGuides = localStorage.getItem('dod_guides');
          const savedSettings = localStorage.getItem('dod_settings');

          if (savedProducts) setProducts(JSON.parse(savedProducts));
          else setProducts(INITIAL_PRODUCTS);

          if (savedCategories) setCategories(JSON.parse(savedCategories));
          else setCategories(INITIAL_CATEGORIES);

          if (savedGuides) setBuyingGuides(JSON.parse(savedGuides));
          else setBuyingGuides(INITIAL_BUYING_GUIDES);

          if (savedSettings) setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
          else setSettings(defaultSettings);
        }
      } catch (error) {
        console.warn("Failed to load initial data gracefully falling back:", error);
      } finally {
        setIsFirebaseSyncing(false);
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded && !isFirebaseConfigured) {
      localStorage.setItem('dod_products', JSON.stringify(products));
      localStorage.setItem('dod_categories', JSON.stringify(categories));
      localStorage.setItem('dod_guides', JSON.stringify(buyingGuides));
      localStorage.setItem('dod_settings', JSON.stringify(settings));
    }
  }, [products, categories, buyingGuides, settings, isLoaded]);

  const addProduct = async (product: Product) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      const success = await saveProductToFirestore(product);
      if (!success) {
        setIsFirebaseSyncing(false);
        throw new Error("Failed to save product to Firestore");
      }
    }
    setProducts(prev => [...prev, product]);
    setIsFirebaseSyncing(false);
  };

  const updateProduct = async (product: Product) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      const success = await saveProductToFirestore(product);
      if (!success) {
        setIsFirebaseSyncing(false);
        throw new Error("Failed to update product in Firestore");
      }
    }
    setProducts(prev => prev.map(p => p.productId === product.productId ? product : p));
    setIsFirebaseSyncing(false);
  };

  const deleteProduct = async (productId: string) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      const success = await deleteProductFromFirestore(productId);
      if (!success) {
        setIsFirebaseSyncing(false);
        throw new Error("Failed to delete product from Firestore");
      }
    }
    setProducts(prev => prev.filter(p => p.productId !== productId));
    setIsFirebaseSyncing(false);
  };

  const bulkImportProducts = async (newProducts: Product[], replace: boolean) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      if (replace) {
        await saveProductsBatchToFirestore(newProducts);
        setProducts(newProducts);
      } else {
        await saveProductsBatchToFirestore(newProducts);
        setProducts(prev => {
          const existingMap = new Map(prev.map(p => [p.productId, p]));
          newProducts.forEach(p => existingMap.set(p.productId, p));
          return Array.from(existingMap.values());
        });
      }
    } else {
      if (replace) {
        setProducts(newProducts);
      } else {
        setProducts(prev => {
          const existingMap = new Map(prev.map(p => [p.productId, p]));
          newProducts.forEach(p => existingMap.set(p.productId, p));
          return Array.from(existingMap.values());
        });
      }
    }
    setIsFirebaseSyncing(false);
  };

  const addCategory = async (category: Category) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      const success = await saveCategoryToFirestore(category);
      if (!success) {
        setIsFirebaseSyncing(false);
        throw new Error("Failed to save category to Firestore");
      }
    }
    setCategories(prev => [...prev, category]);
    setIsFirebaseSyncing(false);
  };

  const updateCategory = async (category: Category) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      const success = await saveCategoryToFirestore(category);
      if (!success) {
        setIsFirebaseSyncing(false);
        throw new Error("Failed to update category in Firestore");
      }
    }
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    setIsFirebaseSyncing(false);
  };

  const deleteCategory = async (categoryId: string) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      const success = await deleteCategoryFromFirestore(categoryId);
      if (!success) {
        setIsFirebaseSyncing(false);
        throw new Error("Failed to delete category from Firestore");
      }
    }
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    setIsFirebaseSyncing(false);
  };

  const addBuyingGuide = async (guide: BuyingGuide) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      const success = await saveBuyingGuideToFirestore(guide);
      if (!success) {
        setIsFirebaseSyncing(false);
        throw new Error("Failed to save buying guide to Firestore");
      }
    }
    setBuyingGuides(prev => [...prev, guide]);
    setIsFirebaseSyncing(false);
  };

  const updateBuyingGuide = async (guide: BuyingGuide) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      const success = await saveBuyingGuideToFirestore(guide);
      if (!success) {
        setIsFirebaseSyncing(false);
        throw new Error("Failed to update buying guide in Firestore");
      }
    }
    setBuyingGuides(prev => prev.map(g => g.id === guide.id ? guide : g));
    setIsFirebaseSyncing(false);
  };

  const deleteBuyingGuide = async (guideId: string) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      const success = await deleteBuyingGuideFromFirestore(guideId);
      if (!success) {
        setIsFirebaseSyncing(false);
        throw new Error("Failed to delete buying guide from Firestore");
      }
    }
    setBuyingGuides(prev => prev.filter(g => g.id !== guideId));
    setIsFirebaseSyncing(false);
  };

  const updateSettings = async (newSettings: SiteSettings) => {
    setIsFirebaseSyncing(true);
    if (isFirebaseConfigured) {
      const success = await saveFirestoreSiteSettings(newSettings);
      if (!success) {
        setIsFirebaseSyncing(false);
        throw new Error("Failed to update settings in Firestore");
      }
    }
    setSettings(newSettings);
    setIsFirebaseSyncing(false);
  };

  const resetToSeedData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setBuyingGuides(INITIAL_BUYING_GUIDES);
    setSettings(defaultSettings);
  };

  const getProductBySlug = (slug: string) => {
    return products.find(p => p.slug === slug || p.productId === slug);
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find(c => c.slug === slug || c.id === slug);
  };

  const getBuyingGuideBySlug = (slug: string) => {
    return buyingGuides.find(g => g.slug === slug || g.id === slug);
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId && p.active && p.published);
  };

  const getRankedProductsForBestCategory = (categoryId: string) => {
    const items: { product: Product, rank: number, label: string, reason?: string }[] = [];
    
    products.filter(p => p.active && p.published).forEach(p => {
      if (p.categoryId === categoryId && p.bestPick) {
        items.push({ 
          product: p, 
          rank: p.bestPickRank || 999, 
          label: p.bestPickBadge || "Recommended", 
          reason: p.description 
        });
      }
    });

    return items.sort((a, b) => a.rank - b.rank);
  };

  const searchProducts = (query: string) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.active && p.published && (
        p.title.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.model?.toLowerCase().includes(lowerQuery) ||
        p.categoryId.toLowerCase().includes(lowerQuery)
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        buyingGuides,
        settings,
        searchQuery,
        setSearchQuery,
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
        getProductBySlug,
        getCategoryBySlug,
        getBuyingGuideBySlug,
        getProductsByCategory,
        getRankedProductsForBestCategory,
        searchProducts,
        isFirebaseSyncing
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
