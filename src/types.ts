export interface Product {
  id: string; // Document ID (often same as productId or slug)
  productId: string; // Stable unique identifier from Excel
  title: string;
  slug: string;
  brand: string;
  model?: string;
  store: string; // e.g. "Amazon", "Flipkart", "Croma", "Official Store"
  originalPrice: number;
  discountedPrice: number;
  discountPercentage?: number;
  affiliateLink: string;
  imageUrl: string; // Single URL or primary image
  imageGallery?: string[]; // Multiple image URLs parsed from commas
  categoryId: string; // e.g. "smartphones", "laptops", "earbuds", etc.
  description: string;
  features?: string[]; // parsed from text/bullet points
  specifications?: Record<string, string>; // parsed key-value specs
  pros?: string[];
  cons?: string[];
  bestFor?: string;
  recommendationScore: number; // e.g. 9.4 (out of 10)
  recommendationLabel?: string; // e.g. "Editor's Choice", "Best Value", "Best Premium", "Best Battery"
  verdict?: string;
  priceLastChecked?: string; // ISO date string
  availability?: 'In Stock' | 'Limited Stock' | 'Out of Stock' | string;
  active: boolean;
  published: boolean;
  
  featured?: boolean;
  featuredOrder?: number;
  
  trending?: boolean;
  trendingOrder?: number;

  bestPick?: boolean;
  bestPickRank?: number;
  bestPickBadge?: string;

  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;

  bestRankings?: {
    categorySlug: string;
    rank: number;
    label: string;
    reason?: string;
  }[];

  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string; // e.g. "smartphones"
  name: string; // e.g. "Smartphones"
  slug: string; // e.g. "smartphones"
  description: string;
  icon?: string; // icon name or emoji
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  active: boolean;
  sortOrder: number;
  featured?: boolean;
  bannerImage?: string;
  bestPicksEnabled?: boolean;
  bestPicksTitle?: string;
  bestPicksDescription?: string;
}

export interface BuyingGuideProduct {
  productId: string;
  order: number;
  label: string; // e.g. "Editor's Choice", "Best Value"
  customReason?: string;
}

export interface BuyingGuide {
  id: string; // e.g. "best-smartphones-under-30000"
  slug: string;
  title: string; // e.g. "Best Smartphones to Buy in India (2026)"
  categoryId: string; // e.g. "smartphones"
  introduction: string;
  verdictSummary?: string;
  content?: string;
  imageUrl?: string;
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  products: BuyingGuideProduct[];
  published: boolean;
  featured?: boolean;
  displayOrder?: number;
  updatedAt: string;
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  telegramUrl: string;
  contactEmail: string;
  affiliateDisclaimer: string;
  headerAnnouncement?: string;
  showAnnouncement?: boolean;
  homepage?: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroDescription?: string;
    exploreBestPicksText?: string;
    exploreBestPicksLink?: string;
    todaysDealsText?: string;
    todaysDealsLink?: string;
    heroBadgeText?: string;
  };
}

export interface ExcelImportRow {
  title: string;
  slug?: string;
  store?: string;
  originalPrice?: number | string;
  discountedPrice?: number | string;
  affiliateLink: string;
  imageUrl: string;
  categoryId: string;
  description?: string;
  features?: string;
  specifications?: string;
  pros?: string;
  cons?: string;
  bestFor?: string;
  recommendationScore?: number | string;
  recommendationLabel?: string;
  priceLastChecked?: string;
  availability?: string;
  productId: string;
  brand?: string;
  model?: string;
  discountPercentage?: number | string;
  active?: string | boolean;
  published?: string | boolean;
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  featured?: string | boolean;
  trending?: string | boolean;

  // Best Guide fields
  bestSmartphones?: string | boolean;
  bestSmartphonesOrder?: number | string;
  bestSmartphonesLabel?: string;

  bestLaptops?: string | boolean;
  bestLaptopsOrder?: number | string;
  bestLaptopsLabel?: string;

  bestEarbuds?: string | boolean;
  bestEarbudsOrder?: number | string;
  bestEarbudsLabel?: string;

  bestSmartwatches?: string | boolean;
  bestSmartwatchesOrder?: number | string;
  bestSmartwatchesLabel?: string;

  bestPowerbanks?: string | boolean;
  bestPowerbanksOrder?: number | string;
  bestPowerbanksLabel?: string;

  bestMonitors?: string | boolean;
  bestMonitorsOrder?: number | string;
  bestMonitorsLabel?: string;

  // Row status during preview
  _rowNumber?: number;
  _status?: 'NEW' | 'UPDATE' | 'ERROR';
  _errors?: string[];
}

export interface ExcelValidationResult {
  valid: boolean;
  totalRows: number;
  newCount: number;
  updateCount: number;
  errorCount: number;
  rows: ExcelImportRow[];
  parsedProducts: Product[];
  errors: { row: number; field: string; message: string; productId?: string }[];
}

