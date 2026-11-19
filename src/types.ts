export type ProductCategory =
  | 'Men'
  | 'Women'
  | 'Kids'
  | 'Accessories'
  | 'Tote Bags'
  | 'Art Work';

export type NavSection =
  | 'Home'
  | ProductCategory
  | 'Admin Access';

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  sizes: string[];
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type PaymentMethod =
  | 'Cash on Delivery (COD)'
  | 'EasyPaisa'
  | 'JazzCash'
  | 'Bank Transfer';

export interface PaymentSettings {
  codEnabled: boolean;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  easypaisaTitle: string;
  easypaisaNumber: string;
  jazzcashTitle: string;
  jazzcashNumber: string;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsappNumber: string;
  whatsappUrl: string;
}

export interface SiteContent {
  announcementEnabled: boolean;
  announcementText: string;
  heroKicker: string;
  heroHeadline: string;
  heroTagline: string;
  heroSubtext: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
  pin: string;
}

export interface StoreData {
  products: Product[];
  payment: PaymentSettings;
  social: SocialLinks;
  content: SiteContent;
  admin: AdminCredentials;
}

export interface CheckoutOrderLine {
  productId: string;
  title: string;
  category: ProductCategory;
  size: string;
  quantity: number;
  unitPrice: number;
}
