import { Product, Category, BuyingGuide, SiteSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Expert-tested flagships, premium camera phones, and high-value budget smartphones.',
    icon: 'Smartphone',
    seoTitle: 'Best Smartphones to Buy in India (2026) | Deals of the Day',
    metaDescription: 'Discover our top recommended smartphones in India based on benchmark speed, camera quality, battery endurance, and value for money.',
    primaryKeyword: 'best smartphones in India',
    active: true,
    sortOrder: 1,
    featured: true
  },
  {
    id: 'laptops',
    name: 'Laptops',
    slug: 'laptops',
    description: 'Top-rated thin-and-light ultrabooks, powerful creator laptops, and high-performance gaming rigs.',
    icon: 'Laptop',
    seoTitle: 'Best Laptops to Buy in India | Deals of the Day',
    metaDescription: 'Find the best laptops for work, college students, video editing, and gaming reviewed and ranked by our tech team.',
    primaryKeyword: 'best laptops in India',
    active: true,
    sortOrder: 2,
    featured: true
  },
  {
    id: 'earbuds',
    name: 'Earbuds & Audio',
    slug: 'earbuds',
    description: 'True wireless earbuds with industry-leading Active Noise Cancellation and hi-fi audio.',
    icon: 'Headphones',
    seoTitle: 'Best Wireless Earbuds in India | Deals of the Day',
    metaDescription: 'Compare top TWS earbuds with ANC, long battery life, and crystal-clear call quality.',
    primaryKeyword: 'best earbuds in India',
    active: true,
    sortOrder: 3,
    featured: true
  },
  {
    id: 'smartwatches',
    name: 'Smartwatches',
    slug: 'smartwatches',
    description: 'Fitness trackers, WearOS watches, and luxury smartwatches with accurate health sensors.',
    icon: 'Watch',
    seoTitle: 'Best Smartwatches in India | Deals of the Day',
    metaDescription: 'Editorial guide to the best smartwatches for fitness tracking, battery longevity, and seamless phone integration.',
    primaryKeyword: 'best smartwatches in India',
    active: true,
    sortOrder: 4,
    featured: true
  },
  {
    id: 'powerbanks',
    name: 'Power Banks',
    slug: 'powerbanks',
    description: 'High-capacity, fast-charging portable chargers for laptops, tablets, and phones on the move.',
    icon: 'BatteryCharging',
    seoTitle: 'Best Fast Charging Power Banks in India | Deals of the Day',
    metaDescription: 'Our top picks for 20000mAh+ power banks with 65W/100W USB-PD laptop fast charging.',
    primaryKeyword: 'best power banks in India',
    active: true,
    sortOrder: 5,
    featured: true
  },
  {
    id: 'monitors',
    name: 'Monitors',
    slug: 'monitors',
    description: 'Color-accurate 4K creator displays and ultra-high refresh rate gaming monitors.',
    icon: 'Monitor',
    seoTitle: 'Best Monitors for Gaming and Productivity | Deals of the Day',
    metaDescription: 'In-depth recommendations for 4K IPS productivity screens and 240Hz fast gaming displays.',
    primaryKeyword: 'best monitors in India',
    active: true,
    sortOrder: 6,
    featured: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. SMARTPHONES
  {
    id: 'iqoo-15-5g',
    productId: 'iqoo-15-5g',
    title: 'iQOO 15 5G (16GB RAM, 256GB Storage)',
    slug: 'iqoo-15-5g-flagship',
    brand: 'iQOO',
    model: '15 5G',
    categoryId: 'smartphones',
    store: 'Amazon',
    originalPrice: 76999,
    discountedPrice: 72999,
    discountPercentage: 5,
    affiliateLink: 'https://amzn.to/example-iqoo-15',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
    ],
    recommendationScore: 9.4,
    recommendationLabel: "Editor's Choice",
    bestFor: 'Ultimate Flagship Performance & Heavy Gaming',
    description: 'The iQOO 15 is our top all-around flagship recommendation for 2026. It packs cutting-edge silicon with unmatched sustained cooling, stunning 2K 144Hz AMOLED screen, and blazing 120W charging that fills the massive 6000mAh battery in under 22 minutes.',
    features: [
      'Qualcomm Snapdragon 8 Elite 3nm Flagship SoC',
      '6000mAh Silicon-Carbon Battery with 120W FlashCharge',
      '6.78-inch 2K 144Hz LTPO AMOLED (4500 nits peak brightness)',
      '50MP Sony LYT-900 1-inch type primary camera with custom OIS',
      'Ultra-linear dual speakers and IP68/IP69 dust and water resistance'
    ],
    specifications: {
      'Display': '6.78" 2K 144Hz LTPO AMOLED (3200x1440)',
      'Processor': 'Snapdragon 8 Elite (3nm)',
      'RAM': '16GB LPDDR5X',
      'Storage': '256GB UFS 4.0',
      'Rear Cameras': '50MP Main (OIS) + 50MP Periscope (3x Optical) + 50MP Ultrawide',
      'Front Camera': '32MP HDR',
      'Battery': '6000mAh with 120W Wired Fast Charging',
      'OS': 'Android 15 (Funtouch OS 15) with 4 OS upgrades guaranteed'
    },
    pros: [
      'Unmatched benchmark & sustained gaming framerates',
      'Blazing fast 120W charger included in the box',
      'Vibrant, ultra-smooth 2K 144Hz display with high outdoor visibility',
      'Very versatile triple 50MP camera setup'
    ],
    cons: [
      'No wireless charging',
      'Some pre-installed apps that require manual cleanup'
    ],
    verdict: 'If raw speed, battery life, and display brilliance are your highest priorities, the iQOO 15 is currently unbeatable in its price bracket.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: true,
    seoTitle: 'iQOO 15 5G Review & Best Price in India',
    metaDescription: 'Expert editorial review of the iQOO 15 5G. Discover specs, camera benchmarks, battery tests, and the latest deals.',
    primaryKeyword: 'iQOO 15 5G',
    bestRankings: [{ categorySlug: 'smartphones', rank: 1, label: "Editor's Choice" }]
  },
  {
    id: 'samsung-galaxy-s25-ultra',
    productId: 'samsung-galaxy-s25-ultra',
    title: 'Samsung Galaxy S25 Ultra (12GB RAM, 256GB Storage, Titanium)',
    slug: 'samsung-galaxy-s25-ultra',
    brand: 'Samsung',
    model: 'Galaxy S25 Ultra',
    categoryId: 'smartphones',
    store: 'Amazon',
    originalPrice: 134999,
    discountedPrice: 129999,
    discountPercentage: 4,
    affiliateLink: 'https://amzn.to/example-s25-ultra',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    recommendationScore: 9.6,
    recommendationLabel: 'Best Premium Flagship',
    bestFor: 'Pro Power Users, Zoom Photography & Productivity',
    description: 'The Galaxy S25 Ultra represents the pinnacle of Android smartphone engineering. With an integrated S Pen stylus, anti-reflective Gorilla Armor glass, 200MP camera system, and 7 years of full software and security updates, it is built to last half a decade.',
    features: [
      'Snapdragon 8 Elite for Galaxy with customized high-clock cores',
      'Integrated S Pen with Bluetooth remote air gestures',
      '200MP Quad Telephoto Camera with 100x Space Zoom and AI ProVisual Engine',
      'Anti-reflective Dynamic AMOLED 2X flat display with titanium frame',
      '7 years of guaranteed Android OS updates and monthly security patches'
    ],
    specifications: {
      'Display': '6.86" Dynamic AMOLED 2X 120Hz Anti-Reflective',
      'Processor': 'Snapdragon 8 Elite for Galaxy',
      'RAM': '12GB LPDDR5X',
      'Storage': '256GB UFS 4.0',
      'Rear Cameras': '200MP Main + 50MP 5x Periscope + 50MP 3x Telephoto + 50MP Ultrawide',
      'Battery': '5000mAh with 45W wired and 15W Qi2 wireless charging',
      'Durability': 'Titanium Frame, IP68, Gorilla Armor Glass'
    },
    pros: [
      'Incredible anti-reflective glass reduces glare significantly',
      'Industry benchmark 200MP & 5x/10x zoom photography',
      'Unmatched 7 years of software support',
      'Built-in S Pen stylus is unmatched for note-taking & sketching'
    ],
    cons: [
      'Premium price tag',
      'Charging speed caps at 45W (no charger in box)'
    ],
    verdict: 'The ultimate luxury smartphone for anyone demanding the finest display, unmatched zoom lenses, and a productive stylus.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: false,
    seoTitle: 'Samsung Galaxy S25 Ultra Price in India & Review',
    metaDescription: 'Complete editorial guide and review of Samsung Galaxy S25 Ultra. Check latest discounts and camera comparisons.',
    primaryKeyword: 'Samsung Galaxy S25 Ultra',
    bestRankings: [{ categorySlug: 'smartphones', rank: 2, label: 'Best Premium Flagship' }]
  },
  {
    id: 'google-pixel-10',
    productId: 'google-pixel-10',
    title: 'Google Pixel 10 (12GB RAM, 128GB Storage, Hazel)',
    slug: 'google-pixel-10',
    brand: 'Google',
    model: 'Pixel 10',
    categoryId: 'smartphones',
    store: 'Flipkart',
    originalPrice: 79999,
    discountedPrice: 74999,
    discountPercentage: 6,
    affiliateLink: 'https://fkrt.it/example-pixel-10',
    imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
    recommendationScore: 9.3,
    recommendationLabel: 'Best Camera Phone',
    bestFor: 'Point-and-Shoot Photography, Clean Android & AI Tools',
    description: 'Powered by the custom TSMC-built Tensor G5 processor, the Google Pixel 10 offers the most natural, consistent point-and-shoot camera on any smartphone, paired with clean stock Android and instant feature drops.',
    features: [
      'Google Tensor G5 (3nm TSMC) next-gen processor',
      'Pixel Camera system with Real Tone and AI Best Take / Magic Editor',
      'Super Actua 6.3-inch 120Hz OLED screen with up to 3000 nits',
      '7 years of direct Pixel software updates and Day-1 Android versions'
    ],
    specifications: {
      'Display': '6.3" Actua OLED 120Hz (1080x2424)',
      'Processor': 'Google Tensor G5',
      'RAM': '12GB',
      'Storage': '128GB',
      'Rear Cameras': '50MP Main (OIS) + 48MP Ultrawide with Macro Focus',
      'Battery': '4700mAh with fast wireless charging'
    },
    pros: [
      'Unrivaled skin-tone accuracy and low-light night sight photography',
      'Pure, bloatware-free Android experience with helpful AI helpers',
      'Compact, ergonomic hand feel with satin matte back finish'
    ],
    cons: [
      'Base model starts at 128GB storage',
      'Charging speed slower than Chinese flagship rivals'
    ],
    verdict: 'The easiest smartphone to take flawless photos with in any lighting scenario.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: false,
    seoTitle: 'Google Pixel 10 Review & Deals in India',
    metaDescription: 'Everything you need to know about Google Pixel 10 with Tensor G5 chip, camera samples, and prices.',
    primaryKeyword: 'Google Pixel 10',
    bestRankings: [{ categorySlug: 'smartphones', rank: 3, label: 'Best Camera Phone' }]
  },
  {
    id: 'oneplus-13r',
    productId: 'oneplus-13r',
    title: 'OnePlus 13R 5G (16GB RAM, 256GB Storage, Astral Black)',
    slug: 'oneplus-13r-5g',
    brand: 'OnePlus',
    model: '13R 5G',
    categoryId: 'smartphones',
    store: 'Amazon',
    originalPrice: 42999,
    discountedPrice: 39999,
    discountPercentage: 7,
    affiliateLink: 'https://amzn.to/example-oneplus-13r',
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    recommendationScore: 9.2,
    recommendationLabel: 'Best Value Flagship',
    bestFor: 'High-end specs under ₹40,000 & 2-day battery life',
    description: 'The OnePlus 13R hits the absolute sweet spot for Indian buyers, bringing flagship-tier Snapdragon processing, a mammoth 6500mAh Glacier battery, and a gorgeous 1.5K ProXDR display at an accessible sub-₹40,000 price point.',
    features: [
      'Snapdragon 8 Gen 3 flagship silicon',
      'Huge 6500mAh battery with 100W SUPERVOOC fast charging',
      '6.78-inch 1.5K 120Hz Oriental AMOLED display',
      'Sony 50MP primary sensor with OIS and Hasselblad color tuning'
    ],
    specifications: {
      'Display': '6.78" 1.5K 120Hz ProXDR AMOLED',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '16GB LPDDR5X',
      'Storage': '256GB UFS 4.0',
      'Battery': '6500mAh with 100W Charger included in box',
      'OS': 'OxygenOS 15 based on Android 15'
    },
    pros: [
      'Phenomenal 2-day battery endurance',
      'Super smooth OxygenOS with zero lag',
      'Flagship Snapdragon performance under ₹40k',
      '100W fast charger included in the box'
    ],
    cons: [
      'Secondary 8MP ultrawide lens is average in low light',
      'No IP68 water rating (IP65 splash-proof)'
    ],
    verdict: 'The undisputed value champion of 2026 for performance seekers on a practical budget.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: true,
    seoTitle: 'OnePlus 13R Review: Best Value Smartphone Under 40000',
    metaDescription: 'Our in-depth OnePlus 13R review covering battery life, gaming benchmarks, camera tests, and best deal links.',
    primaryKeyword: 'OnePlus 13R',
    bestRankings: [{ categorySlug: 'smartphones', rank: 4, label: 'Best Value Flagship' }]
  },

  // 2. LAPTOPS
  {
    id: 'macbook-air-m3-13',
    productId: 'macbook-air-m3-13',
    title: 'Apple MacBook Air 13-inch (M3, 16GB Unified Memory, 512GB SSD)',
    slug: 'apple-macbook-air-m3-13-inch',
    brand: 'Apple',
    model: 'MacBook Air 13 M3',
    categoryId: 'laptops',
    store: 'Amazon',
    originalPrice: 134900,
    discountedPrice: 119900,
    discountPercentage: 11,
    affiliateLink: 'https://amzn.to/example-macbook-m3',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    recommendationScore: 9.6,
    recommendationLabel: 'Best Overall Laptop',
    bestFor: 'College students, working professionals, and everyday productivity',
    description: 'The M3 MacBook Air is the quintessential thin-and-light laptop. Combining a silent fanless aluminum unibody, staggering 18-hour real-world battery life, and crisp Liquid Retina display, it sets the standard for modern portable computers.',
    features: [
      'Apple M3 8-core CPU and 10-core GPU with Hardware-accelerated ray tracing',
      '13.6-inch Liquid Retina display with 500 nits brightness and P3 wide color',
      'MagSafe 3 fast-charging port and two Thunderbolt / USB 4 ports',
      'Silent, completely fanless thermal design',
      'Up to 18 hours of continuous battery life on a single charge'
    ],
    specifications: {
      'Display': '13.6" Liquid Retina (2560x1664, 500 nits)',
      'Processor': 'Apple M3 Chip (8-core CPU, 10-core GPU)',
      'RAM': '16GB Unified Memory',
      'Storage': '512GB High-speed SSD',
      'Weight': '1.24 kg',
      'Battery': 'Up to 18 hours',
      'Ports': 'MagSafe 3, 2x Thunderbolt / USB 4, 3.5mm headphone jack'
    },
    pros: [
      'Industry-leading 18+ hour battery endurance',
      'Zero fan noise—completely silent under all workloads',
      'Best-in-class trackpad and comfortable Magic Keyboard',
      'Sturdy aerospace-grade aluminum chassis'
    ],
    cons: [
      'External dual-display support only works with laptop lid closed',
      'RAM and SSD cannot be upgraded after purchase'
    ],
    verdict: 'The best laptop money can buy for 95% of users. Reliable, whisper-quiet, and enduring.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: false,
    seoTitle: 'Apple MacBook Air M3 Review & Best Deals in India',
    metaDescription: 'Find out why the Apple MacBook Air M3 is our top recommended laptop in India with full test scores.',
    primaryKeyword: 'Apple MacBook Air M3',
    bestRankings: [{ categorySlug: 'laptops', rank: 1, label: 'Best Overall Laptop' }]
  },
  {
    id: 'asus-zenbook-14-oled',
    productId: 'asus-zenbook-14-oled',
    title: 'ASUS Zenbook 14 OLED (Intel Core Ultra 7, 16GB RAM, 1TB SSD)',
    slug: 'asus-zenbook-14-oled',
    brand: 'ASUS',
    model: 'Zenbook 14 OLED UX3405',
    categoryId: 'laptops',
    store: 'Amazon',
    originalPrice: 114990,
    discountedPrice: 99990,
    discountPercentage: 13,
    affiliateLink: 'https://amzn.to/example-zenbook-14',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    recommendationScore: 9.3,
    recommendationLabel: 'Best Windows Ultrabook',
    bestFor: 'Windows power users, writers, and media consumption',
    description: 'Featuring a breathtaking 3K 120Hz OLED screen, a massive 75Wh battery, and lightweight 1.2kg military-grade body, the Zenbook 14 OLED is our favorite Windows portable laptop.',
    features: [
      'Intel Core Ultra 7 155H with Intel Arc Graphics and dedicated NPU for AI',
      '14.0-inch 3K (2880 x 1800) 120Hz 0.2ms Lumina OLED Display',
      '75Wh battery delivering 12+ hours of real-world productivity',
      'Comprehensive ports: 2x Thunderbolt 4, USB-A 3.2, and HDMI 2.1'
    ],
    specifications: {
      'Display': '14.0" 3K 120Hz OLED 100% DCI-P3 (2880x1800)',
      'Processor': 'Intel Core Ultra 7 155H (16 cores, 22 threads)',
      'RAM': '16GB LPDDR5X',
      'Storage': '1TB PCIe 4.0 NVMe SSD',
      'Weight': '1.2 kg',
      'Battery': '75Wh (65W Type-C Fast Charge)'
    },
    pros: [
      'Spectacular 3K 120Hz OLED display with deep infinite blacks',
      'Full port selection including full-size HDMI and USB-A',
      'Sleek, lightweight all-metal build with MIL-STD-810H durability'
    ],
    cons: [
      'Glossy screen can reflect light in bright outdoor sunlight'
    ],
    verdict: 'The best thin-and-light Windows notebook on the market, offering a display that rivals professional monitors.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: false,
    seoTitle: 'ASUS Zenbook 14 OLED Review & Best Price',
    metaDescription: 'Detailed review of ASUS Zenbook 14 OLED with Core Ultra 7 benchmarks and battery life stats.',
    primaryKeyword: 'ASUS Zenbook 14 OLED',
    bestRankings: [{ categorySlug: 'laptops', rank: 2, label: 'Best Windows Ultrabook' }]
  },

  // 3. EARBUDS
  {
    id: 'sony-wf-1000xm5',
    productId: 'sony-wf-1000xm5',
    title: 'Sony WF-1000XM5 Wireless Noise Cancelling Earbuds',
    slug: 'sony-wf-1000xm5-anc-earbuds',
    brand: 'Sony',
    model: 'WF-1000XM5',
    categoryId: 'earbuds',
    store: 'Amazon',
    originalPrice: 24990,
    discountedPrice: 19990,
    discountPercentage: 20,
    affiliateLink: 'https://amzn.to/example-sony-xm5',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    recommendationScore: 9.5,
    recommendationLabel: "Editor's Choice (Best ANC)",
    bestFor: 'Frequent travelers, commuters, and audiophiles',
    description: 'The Sony WF-1000XM5 earbuds deliver unmatched active noise cancellation powered by dual proprietary processors, paired with dynamic 8.4mm Dynamic Driver X drivers for audiophile-grade high-resolution sound.',
    features: [
      'Integrated Processor V2 and HD Noise Cancelling Processor QN2e',
      'Dynamic Driver X with carbon-dome diaphragm for ultra-wide frequency response',
      'LDAC Hi-Res Wireless Audio support and DSEE Extreme upscaling',
      'Multipoint connection to two devices simultaneously'
    ],
    specifications: {
      'Driver Size': '8.4mm Dynamic Driver X',
      'Battery Life': '8 hours with ANC on (24 hours total with case)',
      'Water Resistance': 'IPX4 splash resistant',
      'Codecs Supported': 'LDAC, AAC, SBC, LC3',
      'Charging': 'Qi Wireless Charging & USB-C fast charging'
    },
    pros: [
      'Unrivaled Active Noise Cancellation in crowded planes/trains',
      'Rich, detailed LDAC sound profile with customizable EQ',
      'Significantly smaller and lighter than predecessor XM4'
    ],
    cons: [
      'Glossy plastic edge finish can be slippery to handle'
    ],
    verdict: 'The gold standard for noise-cancelling earbuds.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: true,
    seoTitle: 'Sony WF-1000XM5 Earbuds Review & Deals',
    metaDescription: 'Read our comprehensive review of Sony WF-1000XM5 ANC earbuds with sound tests and price history.',
    primaryKeyword: 'Sony WF-1000XM5',
    bestRankings: [{ categorySlug: 'audio', rank: 1, label: "Editor's Choice (Best ANC)" }]
  },
  {
    id: 'oneplus-buds-pro-3',
    productId: 'oneplus-buds-pro-3',
    title: 'OnePlus Buds Pro 3 (Dual Drivers with Dynaudio, 50dB ANC)',
    slug: 'oneplus-buds-pro-3',
    brand: 'OnePlus',
    model: 'Buds Pro 3',
    categoryId: 'earbuds',
    store: 'Amazon',
    originalPrice: 13999,
    discountedPrice: 11999,
    discountPercentage: 14,
    affiliateLink: 'https://amzn.to/example-oneplus-buds-3',
    imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
    recommendationScore: 9.3,
    recommendationLabel: 'Best Value Premium Earbuds',
    bestFor: 'Balanced acoustic sound, premium leather case feel, and daily calls',
    description: 'Co-created with Danish audio legend Dynaudio, the OnePlus Buds Pro 3 features coaxial dual drivers (11mm woofer + 6mm planar tweeter) that produce punchy bass alongside crystal-clear highs.',
    features: [
      'Coaxial Dual Drivers: 11mm woofer + 6mm micro-planar tweeter',
      'Real-time Adaptive Noise Cancellation up to 50dB',
      'Dual DACs per earbud for distortion-free sound reproduction',
      'Spatial Audio with real-time head tracking and LHDC 5.0 codec'
    ],
    specifications: {
      'Drivers': '11mm Woofer + 6mm Planar Tweeter with Dual DACs',
      'ANC': 'Up to 50dB Adaptive Noise Cancellation',
      'Battery': 'Up to 43 hours total playtime (case + buds)',
      'Water Resistance': 'IP55 buds / IPX4 case',
      'Connectivity': 'Bluetooth 5.4, Google Fast Pair, Multipoint'
    },
    pros: [
      'Gorgeous faux-leather pebble case design',
      'Dual drivers produce rich separation between vocals and deep bass',
      'Excellent voice isolation for office calls'
    ],
    cons: [
      'LHDC 5.0 codec works primarily with OnePlus and select Android phones'
    ],
    verdict: 'Offers 90% of the acoustic quality of flagship earbuds at half the price.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: false,
    seoTitle: 'OnePlus Buds Pro 3 Review & Best Discounts',
    metaDescription: 'Editorial review of OnePlus Buds Pro 3 with Dynaudio tuning and 50dB noise cancellation tests.',
    primaryKeyword: 'OnePlus Buds Pro 3',
    bestRankings: [{ categorySlug: 'audio', rank: 2, label: 'Best Value Premium' }]
  },

  // 4. SMARTWATCHES
  {
    id: 'samsung-galaxy-watch-7',
    productId: 'samsung-galaxy-watch-7',
    title: 'Samsung Galaxy Watch 7 (44mm, Bluetooth, BioActive Sensor)',
    slug: 'samsung-galaxy-watch-7-44mm',
    brand: 'Samsung',
    model: 'Galaxy Watch 7',
    categoryId: 'smartwatches',
    store: 'Amazon',
    originalPrice: 32999,
    discountedPrice: 28999,
    discountPercentage: 12,
    affiliateLink: 'https://amzn.to/example-galaxy-watch-7',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    recommendationScore: 9.4,
    recommendationLabel: 'Best Android Smartwatch',
    bestFor: 'Android users desiring full app ecosystem, ECG, and dual-frequency GPS',
    description: 'With the revolutionary 3nm Exynos W1000 chipset, dual-frequency L1+L5 GPS, and redesigned BioActive health sensor, the Galaxy Watch 7 is the definitive smartwatch for Android users.',
    features: [
      'Exynos W1000 (3nm) processor with ultra-responsive Wear OS 5',
      'Dual-frequency L1+L5 GPS for pinpoint accurate outdoor run tracking',
      'BioActive sensor with ECG, Blood Pressure, sleep apnea detection, and AGEs index',
      'Sapphire Crystal glass display with Armor Aluminum casing'
    ],
    specifications: {
      'Display': '1.5" Super AMOLED Sapphire Crystal (480x480)',
      'Processor': 'Exynos W1000 (3nm)',
      'Storage / RAM': '32GB Storage, 2GB RAM',
      'Battery': '425mAh (Up to 40 hours)',
      'Durability': '5ATM + IP68 / MIL-STD-810H'
    },
    pros: [
      'Dual GPS tracking tracks city runs between skyscrapers with zero drift',
      'Wear OS 5 gives access to Google Maps, WhatsApp, and Spotify offline',
      'Smooth performance with instant app launches'
    ],
    cons: [
      'Battery requires charging every 1.5 days',
      'ECG feature requires paired Samsung phone'
    ],
    verdict: 'The smartest and most capable wrist companion for Android smartphones.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: false,
    seoTitle: 'Samsung Galaxy Watch 7 Review: Best Android Smartwatch',
    metaDescription: 'In-depth review of Galaxy Watch 7 with GPS accuracy tests, sensor breakdowns, and deals.',
    primaryKeyword: 'Samsung Galaxy Watch 7',
    bestRankings: [{ categorySlug: 'wearables', rank: 1, label: 'Best Android Smartwatch' }]
  },

  // 5. POWER BANKS
  {
    id: 'anker-737-power-bank',
    productId: 'anker-737-power-bank',
    title: 'Anker 737 Power Bank (PowerCore 24K, 140W Two-Way Fast Charge)',
    slug: 'anker-737-140w-power-bank',
    brand: 'Anker',
    model: '737 PowerCore 24000',
    categoryId: 'powerbanks',
    store: 'Amazon',
    originalPrice: 12999,
    discountedPrice: 9999,
    discountPercentage: 23,
    affiliateLink: 'https://amzn.to/example-anker-737',
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
    recommendationScore: 9.6,
    recommendationLabel: 'Best Laptop Power Bank',
    bestFor: 'Charging high-power MacBook Pro, Dell XPS, and phones on flights',
    description: 'Equipped with Power Delivery 3.1 and bi-directional 140W output, the Anker 737 can fast-charge a MacBook Pro 16" to 50% in just 28 minutes while providing an informative smart digital display.',
    features: [
      '140W Ultra-Fast Two-Way Charging via USB PD 3.1',
      '24,000mAh capacity (charges an iPhone 16 ~5 times or MacBook Air ~1.3 times)',
      'Smart Digital OLED display showing live input/output wattage and battery health',
      'ActiveShield 2.0 real-time temperature monitoring system'
    ],
    specifications: {
      'Capacity': '24,000 mAh (86.4 Wh - Flight Approved)',
      'Total Output': '140W Max via Single USB-C port',
      'Ports': '2x USB-C (140W max), 1x USB-A (18W max)',
      'Recharge Time': '0 to 100% in 52 minutes with 140W wall charger',
      'Weight': '632 grams'
    },
    pros: [
      'Full 140W output charges power-hungry creator laptops easily',
      'Informative screen shows exact remaining runtime and watts per port',
      'Flight friendly (under 100Wh airline limit)'
    ],
    cons: [
      'Heavier than standard 10,000mAh pocket power banks'
    ],
    verdict: 'The best portable power station for digital nomads and power users.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: true,
    seoTitle: 'Anker 737 Power Bank Review: Best 140W Laptop Charger',
    metaDescription: 'Find specs, charging speed tests, and deal prices for the Anker 737 24000mAh 140W power bank.',
    primaryKeyword: 'Anker 737 Power Bank',
    bestRankings: [{ categorySlug: 'accessories', rank: 1, label: 'Best Laptop Power Bank' }]
  },

  // 6. MONITORS
  {
    id: 'lg-ultragear-27gr95qe',
    productId: 'lg-ultragear-27gr95qe',
    title: 'LG UltraGear 27-inch QHD OLED Gaming Monitor (240Hz, 0.03ms)',
    slug: 'lg-ultragear-27-inch-oled-gaming-monitor',
    brand: 'LG',
    model: '27GR95QE',
    categoryId: 'monitors',
    store: 'Amazon',
    originalPrice: 89000,
    discountedPrice: 69999,
    discountPercentage: 21,
    affiliateLink: 'https://amzn.to/example-lg-oled-monitor',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    recommendationScore: 9.6,
    recommendationLabel: 'Best Gaming Monitor',
    bestFor: 'Competitive Esports gamers and HDR movie enthusiasts',
    description: 'Combining self-lit OLED pixels, instantaneous 0.03ms gray-to-gray response time, and a fluid 240Hz refresh rate, this LG UltraGear display delivers unmatched visual clarity with pure deep blacks.',
    features: [
      '27-inch QHD (2560 x 1440) Anti-Glare Low-Reflection OLED panel',
      '240Hz refresh rate with near-instantaneous 0.03ms GtG response time',
      '1,500,000:1 Contrast Ratio with DCI-P3 98.5% color accuracy',
      'NVIDIA G-SYNC Compatible and AMD FreeSync Premium Pro'
    ],
    specifications: {
      'Screen Size': '27-inch QHD (2560 x 1440)',
      'Panel Type': 'OLED (Anti-glare)',
      'Refresh Rate': '240Hz',
      'Response Time': '0.03ms (GtG)',
      'Connectivity': '2x HDMI 2.1, 1x DisplayPort 1.4, 2x USB 3.0 Hub, Optical Audio Out',
      'Ergonomics': 'Height, Tilt, Swivel, and Pivot adjustment'
    },
    pros: [
      'Infinite contrast with zero backlight bleed or IPS glow',
      '0.03ms response time eliminates motion blur completely',
      'HDMI 2.1 enables full 240Hz at 1440p'
    ],
    cons: [
      'Peak brightness in large 100% white windows is lower than mini-LED'
    ],
    verdict: 'The gold standard monitor for competitive gaming and immersive HDR content.',
    availability: 'In Stock',
    priceLastChecked: '2026-08-15',
    active: true,
    published: true,
    isFeatured: true,
    isTrending: false,
    seoTitle: 'LG UltraGear 27 OLED Review: Best 240Hz Gaming Monitor',
    metaDescription: 'Expert testing and review of the LG UltraGear 27-inch 240Hz OLED gaming monitor in India.',
    primaryKeyword: 'LG UltraGear 27 OLED',
    bestRankings: [{ categorySlug: 'monitors', rank: 1, label: 'Best Gaming Monitor' }]
  }
];

export const INITIAL_BUYING_GUIDES: BuyingGuide[] = [
  {
    id: 'best-smartphones-in-india',
    slug: 'best-smartphones-in-india',
    title: 'Best Smartphones to Buy in India (2026)',
    categoryId: 'smartphones',
    introduction: 'We compare real-world benchmark speeds, sustained gaming thermals, optical camera systems, display brightness, battery endurance, and current live prices to help you choose the best smartphone for your budget.',
    verdictSummary: 'For most buyers demanding peak speed and rapid charging, the iQOO 15 is our Editor’s Choice. Power users who prioritize zoom lenses and note-taking will love the Samsung Galaxy S25 Ultra, while value seekers should look directly at the OnePlus 13R.',
    seoTitle: 'Best Smartphones in India (2026) - Expert Reviews & Rankings',
    metaDescription: 'Comprehensive guide to the best smartphones to buy in India. Read expert recommendations, pros, cons, and current best deal prices.',
    primaryKeyword: 'best smartphones to buy in India',
    secondaryKeywords: 'best smartphones 2026, top camera phones, best phone under 40000',
    published: true,
    featured: true,
    updatedAt: '2026-08-15',
    author: {
      name: 'Aditya Sharma',
      role: 'Lead Technology Editor'
    },
    products: [
      { productId: 'iqoo-15-5g', order: 1, label: "Editor's Choice", customReason: 'Industry-leading speed, brilliant 144Hz 2K display, and 120W flash charging.' },
      { productId: 'samsung-galaxy-s25-ultra', order: 2, label: 'Best Premium Flagship', customReason: 'Anti-reflective screen, 200MP camera system, and integrated S Pen with 7 years of OS updates.' },
      { productId: 'google-pixel-10', order: 3, label: 'Best Camera Phone', customReason: 'Unmatched point-and-shoot camera accuracy, clean Android 15, and instant Google updates.' },
      { productId: 'oneplus-13r', order: 4, label: 'Best Value Flagship', customReason: 'Mammoth 6500mAh battery and Snapdragon 8 Gen 3 performance under ₹40,000.' }
    ]
  },
  {
    id: 'best-laptops-in-india',
    slug: 'best-laptops-in-india',
    title: 'Best Laptops to Buy in India (2026)',
    categoryId: 'laptops',
    introduction: 'From lightweight college ultrabooks to high-end creator workstations, we tested battery life, keyboard comfort, thermal throttling, and screen quality across top brands.',
    verdictSummary: 'The Apple MacBook Air M3 remains our top overall laptop recommendation for students and professionals. For Windows enthusiasts, the ASUS Zenbook 14 OLED provides a jaw-dropping 3K display with incredible port flexibility.',
    seoTitle: 'Best Laptops in India - Tested & Ranked by Editors',
    metaDescription: 'Find the highest rated laptops for college, remote work, video editing, and software development.',
    primaryKeyword: 'best laptops in India',
    published: true,
    featured: true,
    updatedAt: '2026-08-15',
    author: {
      name: 'Rohan Mehra',
      role: 'Senior Hardware Reviewer'
    },
    products: [
      { productId: 'macbook-air-m3-13', order: 1, label: 'Best Overall Laptop', customReason: '18-hour battery longevity and completely silent fanless computing.' },
      { productId: 'asus-zenbook-14-oled', order: 2, label: 'Best Windows Ultrabook', customReason: 'Stunning 3K 120Hz OLED screen and generous port selection under 1.2kg.' }
    ]
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'Deals of the Day',
  siteUrl: 'https://dealsofthedayonline.in',
  telegramUrl: 'https://t.me/dealsoftheday004',
  contactEmail: 'contact@dealsofthedayonline.in',
  affiliateDisclaimer: 'Prices, discounts and product availability are accurate as of the date/time indicated and are subject to change. Deals of the Day is an editorial recommendation publication supported by affiliate links. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you.',
  headerAnnouncement: '⚡ Best Tech Deals & Editorial Picks for August 2026 — Verified Daily',
  showAnnouncement: true
};
