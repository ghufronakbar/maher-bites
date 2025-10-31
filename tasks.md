PERAN
Anda adalah Senior Frontend + SEO Engineer untuk brand “Maher Bites”. Bangun landing page dan halaman produk berbahasa Indonesia. Tidak ada fitur checkout/keranjang — CTA hanya redirect ke WhatsApp dengan pesan terisi. Data disediakan lewat fungsi di `/src/data/*.ts` agar bisa diganti ke sumber lain (CMS/API) di masa depan.

TEKNOLOGI
- Next.js (App Router) + TypeScript
- Tailwind CSS
- next/image
- ESLint + Prettier

LAYOUT & HALAMAN
1) `/` (Landing):
   - Hero (headline, subheadline, CTA WhatsApp “Pesan via WhatsApp”, CTA sekunder “Lihat Katalog”).
   - USP Grid: Bahan Premium • Halal* (jangan di data produk) • Fresh Baked • Delivery Cepat.
   - Best Sellers (4–8 produk).
   - Testimonials.
   - FAQ singkat.
   - Sticky CTA WA di mobile.
2) `/products` (Listing):
   - Grid kartu produk (foto, nama, harga, rating opsional, tombol “Pesan via WhatsApp”).
   - Filter sederhana per kategori (client-side).
3) `/products/[slug]` (Detail Produk):
   - Gambar utama + galeri, nama, harga, deskripsi, varian (jika ada), qty.
   - Tombol “Pesan via WhatsApp” → generate URL WA dengan teks terisi: nama produk, varian, qty, catatan.

CATATAN FITUR
- ❌ Tidak ada keranjang/checkout pembayaran.
- ✅ Semua CTA mengarah ke `site.whatsapp` dengan query `text` terisi.
- ✅ Rating boleh ada (opsional). **Jangan** ada `stockStatus`, `reviewCount`, `halal` di tipe produk.
- Navigasi: Beranda, Produk, Tentang, Kontak (tanpa Artikel).

SEO TEKNIS
- Meta title/description default dari `/src/data/seo.ts`.
- OG/Twitter tags; og:image default.
- JSON-LD: Organization, WebSite (SearchAction), BreadcrumbList, Product (di PDP), FAQPage (di landing).
- sitemap.xml & robots.txt.
- Canonical tags; hreflang id-ID.
- Internal linking: landing → kategori & produk unggulan.

A11Y & PERFORMA
- WCAG 2.2 AA dasar (alt img, fokus, landmark, kontras).
- Lazy image, responsive `sizes`, preload hero jika perlu.
- Font system default atau 1 webfont `display=swap` + preconnect.
- Target Lighthouse mobile ≥95.

ANALYTICS (placeholder)
- Hook pageview & event “wa_click” (tanpa mengirim data real).

====================================================
BUAT FILE DATA (WAJIB) DI `/src/data/*.ts` — GUNAKAN FUNGSI
====================================================

1) `/src/data/schema.ts`
```ts
// /src/data/schema.ts
export type Currency = 'IDR';

export interface Site {
  name: string;
  domain: string;
  locale: 'id-ID';
  whatsapp: string; // e.g. https://wa.me/6281234567890
  email: string;
  phone: string;
  address: string;
  social: { instagram?: string; tiktok?: string; facebook?: string };
  hours?: string;
  logo: { light: string; dark: string };
}

export interface NavItem { label: string; href: string; children?: NavItem[] }

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

export interface VariantOption { id: string; label: string; price: number }
export interface Variant { name: string; options: VariantOption[] }

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
  rating?: number; // 0-5 (opsional)
  weightGram?: number;
  ingredients?: string[];
  allergens?: string[];
  shelfLifeDays?: number;
  storage?: string;
  variants?: Variant[];
  bestSeller?: boolean;
}

export interface FAQ { q: string; a: string }

export interface Testimonial {
  name: string;
  handle?: string;
  message: string;
  rating: number;
  source?: 'instagram' | 'tiktok' | 'whatsapp' | 'google';
}
/src/data/site.ts

ts
Copy code
// /src/data/site.ts
import type { Site } from './schema';

export const site: Site = {
  name: 'Maher Bites',
  domain: 'https://maherbites.id',
  locale: 'id-ID',
  whatsapp: 'https://wa.me/6281234567890',
  email: 'hello@maherbites.id',
  phone: '+62 812-3456-7890',
  address: 'Jl. Contoh No. 12, Jakarta Selatan',
  social: {
    instagram: 'https://instagram.com/maherbites',
    tiktok: 'https://tiktok.com/@maherbites',
    facebook: 'https://facebook.com/maherbites',
  },
  hours: 'Senin–Sabtu 09.00–18.00 WIB',
  logo: { light: '/images/brand/logo-light.svg', dark: '/images/brand/logo-dark.svg' },
};
/src/data/navigation.ts

ts
Copy code
// /src/data/navigation.ts
import type { NavItem } from './schema';

export const nav: NavItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Produk', href: '/products' },
  { label: 'Tentang', href: '/about' },
  { label: 'Kontak', href: '/contact' },
];
/src/data/seo.ts

ts
Copy code
// /src/data/seo.ts
import type { SEOConfig } from './schema';
import { site } from './site';

export const seo: SEOConfig = {
  defaultTitle: 'Maher Bites — Camilan Manis, Bikin Hati Habis',
  defaultDescription:
    'Maher Bites menghadirkan cookies dan snack fresh-baked dengan bahan premium. Cocok untuk hampers, event, dan daily treat. Pesan antar cepat area Jabodetabek.',
  keywords: [
    'maher bites',
    'cookies',
    'kue kering',
    'snack box',
    'hampers',
    'kue kering premium',
  ],
  ogImage: `${site.domain}/og/default.png`,
  twitterHandle: '@maherbites',
  siteUrl: site.domain,
};
/src/data/categories.ts (pakai fungsi)

ts
Copy code
// /src/data/categories.ts
import type { Category } from './schema';

const _categories: Category[] = [
  { id: 'cookies', slug: 'cookies', name: 'Cookies', description: 'Cookies renyah & chewy, dipanggang harian.' },
  { id: 'snackbox', slug: 'snack-box', name: 'Snack Box', description: 'Paket camilan praktis untuk meeting & acara.' },
  { id: 'hampers', slug: 'hampers', name: 'Hampers', description: 'Hadiah manis untuk momen spesial.' },
];

export async function getAllCategories(): Promise<Category[]> {
  return Promise.resolve(_categories);
}
export async function getCategoryById(id: string): Promise<Category | undefined> {
  return Promise.resolve(_categories.find(c => c.id === id));
}
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return Promise.resolve(_categories.find(c => c.slug === slug));
}
/src/data/products.ts (pakai fungsi + best practice WA link dibuat di wa.ts)

ts
Copy code
// /src/data/products.ts
import type { Product } from './schema';

const _products: Product[] = [
  {
    id: 'chocochip-classic',
    slug: 'chocochip-classic',
    name: 'ChocoChip Classic',
    sku: 'MB-CK-01',
    price: 65000,
    currency: 'IDR',
    categoryId: 'cookies',
    tags: ['best-seller', 'cokelat', 'renyah'],
    images: [
      { src: '/images/products/chocochip-classic-1.jpg', alt: 'ChocoChip Classic Maher Bites' },
      { src: '/images/products/chocochip-classic-2.jpg', alt: 'Detail cookies chocochip' },
    ],
    shortDesc: 'Cookies chocochip renyah di luar, chewy di dalam.',
    longDesc:
      'Dipanggang harian menggunakan butter premium dan dark chocolate chips. Cocok untuk teman ngopi atau hadiah.',
    rating: 4.8,
    weightGram: 180,
    ingredients: ['Tepung', 'Butter', 'Gula', 'Cokelat', 'Telur', 'Vanila'],
    allergens: ['Gluten', 'Telur', 'Susu'],
    shelfLifeDays: 10,
    storage: 'Simpan di wadah kedap pada suhu ruang sejuk.',
    variants: [
      { name: 'Ukuran', options: [
        { id: 's', label: 'S (180g)', price: 65000 },
        { id: 'm', label: 'M (300g)', price: 95000 },
      ] }
    ],
    bestSeller: true,
  },
  {
    id: 'redvelvet-crinkle',
    slug: 'redvelvet-crinkle',
    name: 'Red Velvet Crinkle',
    sku: 'MB-CK-02',
    price: 70000,
    currency: 'IDR',
    categoryId: 'cookies',
    tags: ['manis', 'lembut'],
    images: [{ src: '/images/products/redvelvet-crinkle-1.jpg', alt: 'Red Velvet Crinkle Maher Bites' }],
    shortDesc: 'Crinkle lembut dengan sentuhan krim keju.',
    longDesc: 'Tekstur fudgy dengan rasa kakao dan krim keju yang seimbang. Favorit untuk hampers.',
    rating: 4.7,
    weightGram: 180,
    allergens: ['Gluten', 'Telur', 'Susu'],
    shelfLifeDays: 8,
    storage: 'Simpan di wadah kedap pada suhu ruang.',
    variants: [
      { name: 'Ukuran', options: [
        { id: 'p', label: 'Paket (12 pcs)', price: 70000 },
        { id: 'l', label: 'Paket (24 pcs)', price: 120000 },
      ] }
    ],
    bestSeller: true,
  },
  {
    id: 'cheese-stick',
    slug: 'cheese-stick',
    name: 'Cheese Stick Savory',
    sku: 'MB-SN-01',
    price: 60000,
    currency: 'IDR',
    categoryId: 'snackbox',
    tags: ['gurih', 'keju'],
    images: [{ src: '/images/products/cheese-stick-1.jpg', alt: 'Cheese Stick Savory Maher Bites' }],
    shortDesc: 'Camilan gurih keju, kriuk maksimal.',
    longDesc: 'Dibuat dari keju berkualitas. Pas untuk snack box meeting dan bekal.',
    rating: 4.6,
    weightGram: 150,
    ingredients: ['Tepung', 'Keju', 'Butter', 'Garam'],
    allergens: ['Gluten', 'Susu'],
    shelfLifeDays: 14,
    storage: 'Tutup rapat setelah dibuka agar tetap renyah.',
  },
  {
    id: 'hampers-sweet-duo',
    slug: 'hampers-sweet-duo',
    name: 'Hampers Sweet Duo',
    sku: 'MB-HM-01',
    price: 185000,
    currency: 'IDR',
    categoryId: 'hampers',
    tags: ['hadiah', 'paket'],
    images: [{ src: '/images/products/hampers-sweet-duo-1.jpg', alt: 'Hampers Sweet Duo Maher Bites' }],
    shortDesc: 'Paket 2 varian cookies favorit + kartu ucapan.',
    longDesc: 'Pilihan ideal untuk ulang tahun dan momen spesial. Kartu ucapan bisa custom.',
    rating: 4.9,
    variants: [
      { name: 'Pilihan Varian', options: [
        { id: 'cc-rv', label: 'ChocoChip + Red Velvet', price: 185000 },
        { id: 'cc-cs', label: 'ChocoChip + Cheese Stick', price: 185000 },
      ] }
    ],
    bestSeller: true,
  },
];

export async function getAllProducts(): Promise<Product[]> {
  return Promise.resolve(_products);
}
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return Promise.resolve(_products.find(p => p.slug === slug));
}
export async function getProductsByCategoryId(categoryId: string): Promise<Product[]> {
  return Promise.resolve(_products.filter(p => p.categoryId === categoryId));
}
export async function searchProducts(q: string): Promise<Product[]> {
  const s = q.toLowerCase();
  return Promise.resolve(
    _products.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.tags.some(t => t.toLowerCase().includes(s)) ||
      p.shortDesc.toLowerCase().includes(s)
    )
  );
}
export async function getBestSellers(limit = 8): Promise<Product[]> {
  const best = _products.filter(p => p.bestSeller);
  return Promise.resolve(best.slice(0, limit));
}
/src/data/faqs.ts (pakai fungsi)

ts
Copy code
// /src/data/faqs.ts
import type { FAQ } from './schema';

const _faqs: FAQ[] = [
  { q: 'Apakah produk tersedia setiap hari?', a: 'Ya, dipanggang harian. Untuk paket khusus/hampers disarankan pre-order H-2.' },
  { q: 'Bagaimana cara pesan?', a: 'Klik tombol “Pesan via WhatsApp” di produk yang diinginkan dan kirim pesan otomatis yang muncul.' },
  { q: 'Berapa lama masa simpan cookies?', a: 'Rata-rata 7–14 hari di suhu ruang sejuk dalam wadah kedap.' },
  { q: 'Apakah bisa custom untuk acara?', a: 'Bisa. Anda dapat menyesuaikan varian, jumlah, dan kartu ucapan.' },
];

export async function getFAQs(): Promise<FAQ[]> {
  return Promise.resolve(_faqs);
}
/src/data/testimonials.ts (pakai fungsi)

ts
Copy code
// /src/data/testimonials.ts
import type { Testimonial } from './schema';

const _testimonials: Testimonial[] = [
  { name: 'Nadia', handle: '@nadiafoodie', message: 'ChocoChip-nya juara! Renyah luar, chewy dalam.', rating: 5, source: 'instagram' },
  { name: 'Rafi', message: 'Snack box untuk meeting datang tepat waktu dan rapi.', rating: 5, source: 'whatsapp' },
  { name: 'Saras', handle: '@sarasmakan', message: 'Red Velvet Crinkle lembut, manisnya pas.', rating: 4, source: 'instagram' },
];

export async function getTestimonials(): Promise<Testimonial[]> {
  return Promise.resolve(_testimonials);
}
/src/data/wa.ts (utility link WhatsApp)

ts
Copy code
// /src/data/wa.ts
import { site } from './site';
import type { Product, Variant } from './schema';

interface WAParams {
  product: Product;
  qty?: number;
  variantOptionLabel?: string; // mis: 'S (180g)'
  note?: string;
}

export function createWAOrderLink({ product, qty = 1, variantOptionLabel, note }: WAParams): string {
  const lines = [
    `Halo Maher Bites, saya ingin pesan:`,
    `• Produk: ${product.name}`,
    variantOptionLabel ? `• Varian: ${variantOptionLabel}` : undefined,
    `• Qty: ${qty}`,
    note ? `• Catatan: ${note}` : undefined,
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join('\n'));
  return `${site.whatsapp}?text=${text}`;
}
(Opsional) /src/data/index.ts (re-export)

ts
Copy code
// /src/data/index.ts
export * from './schema';
export * from './site';
export * from './navigation';
export * from './seo';
export * from './categories';
export * from './products';
export * from './faqs';
export * from './testimonials';
export * from './wa';
====================================================
PETUNJUK IMPLEMENTASI KOMPONEN (RINGKAS)
ProductCard: tampilkan gambar, nama, harga (IDR), badge “Best Seller” jika bestSeller, tombol “Pesan via WhatsApp” → gunakan createWAOrderLink.

ProductDetail: varian (radio/select). Saat klik “Pesan via WhatsApp”, ambil label varian terpilih + qty → bentuk link WA.

StickyWAButton (mobile): selalu terlihat di bawah; klik → site.whatsapp.

SEO:

Tambahkan JSON-LD Product di /products/[slug] (name, image[], description, offers.priceCurrency="IDR", offers.price, brand.name="Maher Bites").

JSON-LD Organization & WebSite + SearchAction di root layout.

JSON-LD FAQPage di landing dari getFAQs().

BreadcrumbList: Home › Produk › {Nama Produk}.

Sitemap/robots: izinkan crawl semua halaman publik, exclude /api/*.

QUALITY GATES

Tanpa console error.

CLS < 0.1, LCP < 2.5s (mobile).

Semua gambar ber-alt, tombol berteks jelas (hindari “klik di sini”).

Internal link: landing → /products?category=cookies serta ke best sellers.