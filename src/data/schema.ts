export type Currency = 'IDR';

export interface Site {
  name: string;
  domain: string;
  locale: 'id-ID';
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  social: { instagram?: string; tiktok?: string; facebook?: string };
  hours?: string;
  logo: { light: string; dark: string };
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SEOConfig {
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  ogImage: string;
  twitterHandle?: string;
  siteUrl: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface VariantOption {
  id: string;
  label: string;
  price: number;
}

export interface Variant {
  name: string;
  options: VariantOption[];
}

export interface Product {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  price: number;
  currency: Currency;
  categoryId: string;
  tags: string[];
  images: ProductImage[];
  shortDesc: string;
  longDesc: string;
  rating?: number;
  weightGram?: number;
  ingredients?: string[];
  allergens?: string[];
  shelfLifeDays?: number;
  storage?: string;
  variants?: Variant[];
  bestSeller?: boolean;
}

export interface FAQ {
  id?: number;
  q: string;
  a: string;
  sortOrder?: number;
}

export interface Testimonial {
  id?: number;
  name: string;
  handle?: string;
  message: string;
  rating: number;
  source?: 'instagram' | 'tiktok' | 'whatsapp' | 'google';
  sortOrder?: number;
}
