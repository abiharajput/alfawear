import { ProductCategory, StoreData } from '../types';

export const STORE_STORAGE_KEY = 'alfawear_store_v1';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Men',
  'Women',
  'Kids',
  'Accessories',
  'Tote Bags',
  'Art Work',
];

export const BRAND_CONTACT = {
  brandName: 'AlfaWear',
  tagline: 'DEFINE YOUR STYLE. OWN YOUR IDENTITY.',
  address: 'Al-Nabi Colony, Shah Jahangir Road, Iqbal Street No 4, Gujrat, Punjab, Pakistan',
  shortAddress: 'Al-Nabi Colony, Shah Jahangir Road, Iqbal Street No 4, Gujrat',
  phoneDisplay: '0345-7255076',
  phoneIntl: '+92 345 7255076',
  whatsappBase: 'https://wa.me/923457255076',
  adminEmail: 'info.abiharajput@gmail.com',
};

export const DEFAULT_STORE_DATA: StoreData = {
  products: [
    {
      id: 'aw-women-01',
      title: 'Blush Rose Embroidered Lawn Co-Ord Set',
      category: 'Women',
      price: 4250,
      compareAtPrice: 4950,
      sizes: ['S', 'M', 'L', 'XL'],
      image: '/src/assets/images/product_women_embroidered_set_1795113649883.jpg',
      description:
        'Breathable combed Pakistani lawn 3-piece stitched set in soft blush rose with delicate ivory floral threadwork and matching chiffon dupatta.',
      inStock: true,
      featured: true,
    },
    {
      id: 'aw-men-01',
      title: 'Sandstone Tailored Cotton Overshirt',
      category: 'Men',
      price: 3450,
      compareAtPrice: 3900,
      sizes: ['S', 'M', 'L', 'XL'],
      image: '/src/assets/images/product_men_kurta_overshirt_1795113649504.jpg',
      description:
        'Structured heavyweight brushed cotton overshirt with dual chest pockets and clean matte buttons. Versatile layering for smart-casual days.',
      inStock: true,
      featured: true,
    },
    {
      id: 'aw-tote-01',
      title: 'Signature Wolf Emblem Canvas Tote Bag',
      category: 'Tote Bags',
      price: 1650,
      compareAtPrice: 1950,
      sizes: ['Standard'],
      image: '/src/assets/images/product_canvas_tote_bag_1795113650171.jpg',
      description:
        '14oz unbleached natural cotton canvas tote featuring AlfaWear geometric wolf line-art in rose pink and charcoal with reinforced shoulder straps.',
      inStock: true,
      featured: true,
    },
    {
      id: 'aw-kids-01',
      title: 'Tangerine & Cream Kids Fleece Set',
      category: 'Kids',
      price: 2650,
      sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
      image: '/src/assets/images/product_kids_casual_set_1795113650599.jpg',
      description:
        'Soft ring-spun cotton fleece crewneck sweatshirt paired with relaxed ivory joggers and contrast drawstring for active everyday comfort.',
      inStock: true,
      featured: true,
    },
    {
      id: 'aw-men-02',
      title: 'Emerald Core Heavyweight Hoodie Tracksuit',
      category: 'Men',
      price: 4600,
      compareAtPrice: 5200,
      sizes: ['S', 'M', 'L', 'XL'],
      image: '/src/assets/images/product_mens_athletic_hoodie_1795113650340.jpg',
      description:
        'Premium 380 GSM cotton-rich emerald hoodie and contrast-waistband joggers engineered for crisp structure and all-season wear.',
      inStock: true,
      featured: true,
    },
    {
      id: 'aw-acc-01',
      title: 'Alabaster Cotton Cap & Pastel Scarf Kit',
      category: 'Accessories',
      price: 1850,
      sizes: ['Standard'],
      image: '/src/assets/images/product_lifestyle_accessories_1795113649882.jpg',
      description:
        'Minimalist brushed twill adjustable cap paired with a soft watercolor-print satin pocket scarf for effortless daytime styling.',
      inStock: true,
      featured: true,
    },
    {
      id: 'aw-art-01',
      title: 'Geometric Wolf & Botanical Oak Framed Print',
      category: 'Art Work',
      price: 3200,
      compareAtPrice: 3650,
      sizes: ['A3 Frame', 'A2 Frame'],
      image: '/src/assets/images/product_artwork_framed_print_1795113650849.jpg',
      description:
        'Archival matte giclee art print combining AlfaWear geometric wolf motif with botanical forms in rose, emerald, and warm ochre inside a solid light oak frame.',
      inStock: true,
      featured: true,
    },
    {
      id: 'aw-tote-02',
      title: 'Gujrat Studio Everyday Market Tote',
      category: 'Tote Bags',
      price: 1450,
      sizes: ['Standard'],
      image: '/src/assets/images/hero_alfawear_fashion_1795113647246.jpg',
      description:
        'Spacious wide-gusset everyday cotton canvas tote with warm terracotta botanical illustration and soft leather-look carry handles.',
      inStock: true,
    },
    {
      id: 'aw-women-02',
      title: 'Blush Tailored Linen Studio Jacket',
      category: 'Women',
      price: 3950,
      sizes: ['S', 'M', 'L'],
      image: '/src/assets/images/hero_alfawear_fashion_1795113647246.jpg',
      description:
        'Lightweight pastel rose linen-cotton utility jacket tailored for crisp drape, rolled sleeves, and effortless pairing with trousers or kurtis.',
      inStock: true,
    },
  ],
  payment: {
    codEnabled: true,
    freeDeliveryThreshold: 6000,
    deliveryFee: 250,
    easypaisaTitle: 'AlfaWear Official (Abiha Rajput)',
    easypaisaNumber: '0345-7255076',
    jazzcashTitle: 'AlfaWear Official (Abiha Rajput)',
    jazzcashNumber: '0345-7255076',
    bankName: 'Meezan Bank Limited',
    bankAccountTitle: 'AlfaWear Lifestyle',
    bankAccountNumber: 'PK00MEZN0002810100000000',
  },
  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/',
    whatsappNumber: '0345-7255076',
    whatsappUrl: 'https://wa.me/923457255076',
  },
  content: {
    announcementEnabled: true,
    announcementText: 'Free Nationwide Delivery on Orders Above PKR 6,000.',
    heroKicker: 'Gujrat, Punjab · Pakistani Fashion & Lifestyle',
    heroHeadline: 'DEFINE YOUR STYLE.',
    heroTagline: 'OWN YOUR IDENTITY.',
    heroSubtext:
      'Fresh, bright everyday fashion for Men, Women & Kids alongside signature Wolf-emblem Tote Bags, Accessories, and framed Art Work—delivered across Pakistan.',
    primaryCtaText: 'SHOP NOW',
    secondaryCtaText: 'EXPLORE COLLECTION',
  },
  admin: {
    email: 'info.abiharajput@gmail.com',
    password: 'alfawear2026',
    pin: '7255',
  },
};

const LEGACY_ANNOUNCEMENT =
  'Free Nationwide Delivery on Orders Above PKR 3,500 · Cash on Delivery & EasyPaisa Accepted';

export function loadStoreData(): StoreData {
  try {
    const raw = window.localStorage.getItem(STORE_STORAGE_KEY);
    if (!raw) return DEFAULT_STORE_DATA;
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    const mergedPayment = { ...DEFAULT_STORE_DATA.payment, ...(parsed.payment ?? {}) };
    const mergedContent = { ...DEFAULT_STORE_DATA.content, ...(parsed.content ?? {}) };

    if (mergedPayment.freeDeliveryThreshold === 3500) {
      mergedPayment.freeDeliveryThreshold = 6000;
    }
    if (mergedContent.announcementText === LEGACY_ANNOUNCEMENT) {
      mergedContent.announcementText = DEFAULT_STORE_DATA.content.announcementText;
    }

    return {
      products:
        Array.isArray(parsed.products) && parsed.products.length > 0
          ? parsed.products
          : DEFAULT_STORE_DATA.products,
      payment: mergedPayment,
      social: { ...DEFAULT_STORE_DATA.social, ...(parsed.social ?? {}) },
      content: mergedContent,
      admin: { ...DEFAULT_STORE_DATA.admin, ...(parsed.admin ?? {}) },
    };
  } catch {
    return DEFAULT_STORE_DATA;
  }
}

export function saveStoreData(data: StoreData): void {
  try {
    window.localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded or unavailable in private mode
  }
}

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function buildWhatsAppLink(baseUrl: string, message: string): string {
  const cleanBase = baseUrl?.trim() || BRAND_CONTACT.whatsappBase;
  const separator = cleanBase.includes('?') ? '&' : '?';
  return `${cleanBase}${separator}text=${encodeURIComponent(message)}`;
}
