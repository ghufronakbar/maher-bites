import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS } from '@/lib/cache';
import { revalidateTag } from 'next/cache';

const siteSeed = {
  id: 1,
  name: 'Maher Snack & Cookies',
  domain: 'https://mahersnackandcookies.id',
  locale: 'id-ID',
  whatsapp: 'https://wa.me/6281234567890',
  email: 'hello@mahersnackandcookies.id',
  phone: '+62 812-3456-7890',
  address: 'Jl. Contoh No. 12, Jakarta Selatan',
  hours: 'Senin–Sabtu 09.00–18.00 WIB',
  logoLight: '/images/brand/logo-light.svg',
  logoDark: '/images/brand/logo-dark.svg',
  instagram: 'https://instagram.com/maherbites',
  tiktok: 'https://tiktok.com/@maherbites',
  facebook: 'https://facebook.com/maherbites',
  defaultTitle: 'Maher Snack & Cookies — Camilan Manis, Bikin Hati Habis',
  defaultDescription:
    'Maher Snack & Cookies menghadirkan cookies dan snack fresh-baked dengan bahan premium. Cocok untuk hampers, event, dan daily treat. Pesan antar cepat area Jabodetabek.',
  keywords: [
    'maher snack & cookies',
    'cookies',
    'kue kering',
    'snack box',
    'hampers',
    'kue kering premium',
  ],
  ogImage: 'https://maherbites.id/og/default.png',
  twitterHandle: '@maherbites',
};

const categorySeeds = [
  {
    id: 'cookies',
    slug: 'cookies',
    name: 'Cookies',
    description: 'Cookies renyah & chewy, dipanggang harian.',
  },
  {
    id: 'snackbox',
    slug: 'snack-box',
    name: 'Snack Box',
    description: 'Paket camilan praktis untuk meeting & acara.',
  },
  {
    id: 'hampers',
    slug: 'hampers',
    name: 'Hampers',
    description: 'Hadiah manis untuk momen spesial.',
  },
] as const;

const productSeeds = [
  {
    id: 'chocochip-classic',
    slug: 'chocochip-classic',
    sku: 'MB-CK-01',
    name: 'ChocoChip Classic',
    price: 65000,
    currency: 'IDR',
    categoryId: 'cookies',
    tags: ['best-seller', 'cokelat', 'renyah'],
    images: [
      {
        src: '/images/products/chocochip-classic-1.svg',
        alt: 'ChocoChip Classic Maher Snack & Cookies',
      },
      {
        src: '/images/products/chocochip-classic-2.svg',
        alt: 'Detail cookies chocochip',
      },
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
      {
        name: 'Ukuran',
        options: [
          { value: 's', label: 'S (180g)', price: 65000 },
          { value: 'm', label: 'M (300g)', price: 95000 },
        ],
      },
    ],
    bestSeller: true,
  },
  {
    id: 'redvelvet-crinkle',
    slug: 'redvelvet-crinkle',
    sku: 'MB-CK-02',
    name: 'Red Velvet Crinkle',
    price: 70000,
    currency: 'IDR',
    categoryId: 'cookies',
    tags: ['manis', 'lembut'],
    images: [
      {
        src: '/images/products/redvelvet-crinkle-1.svg',
        alt: 'Red Velvet Crinkle Maher Snack & Cookies',
      },
    ],
    shortDesc: 'Crinkle lembut dengan sentuhan krim keju.',
    longDesc:
      'Tekstur fudgy dengan rasa kakao dan krim keju yang seimbang. Favorit untuk hampers.',
    rating: 4.7,
    weightGram: 180,
    allergens: ['Gluten', 'Telur', 'Susu'],
    shelfLifeDays: 8,
    storage: 'Simpan di wadah kedap pada suhu ruang.',
    variants: [
      {
        name: 'Ukuran',
        options: [
          { value: 'p', label: 'Paket (12 pcs)', price: 70000 },
          { value: 'l', label: 'Paket (24 pcs)', price: 120000 },
        ],
      },
    ],
    bestSeller: true,
  },
  {
    id: 'cheese-stick',
    slug: 'cheese-stick',
    sku: 'MB-SN-01',
    name: 'Cheese Stick Savory',
    price: 60000,
    currency: 'IDR',
    categoryId: 'snackbox',
    tags: ['gurih', 'keju'],
    images: [
      {
        src: '/images/products/cheese-stick-1.svg',
        alt: 'Cheese Stick Savory Maher Snack & Cookies',
      },
    ],
    shortDesc: 'Camilan gurih keju, kriuk maksimal.',
    longDesc:
      'Dibuat dari keju berkualitas. Pas untuk snack box meeting dan bekal.',
    rating: 4.6,
    weightGram: 150,
    ingredients: ['Tepung', 'Keju', 'Butter', 'Garam'],
    allergens: ['Gluten', 'Susu'],
    shelfLifeDays: 14,
    storage: 'Tutup rapat setelah dibuka agar tetap renyah.',
    variants: [],
    bestSeller: false,
  },
  {
    id: 'hampers-sweet-duo',
    slug: 'hampers-sweet-duo',
    sku: 'MB-HM-01',
    name: 'Hampers Sweet Duo',
    price: 185000,
    currency: 'IDR',
    categoryId: 'hampers',
    tags: ['hadiah', 'paket'],
    images: [
      {
        src: '/images/products/hampers-sweet-duo-1.svg',
        alt: 'Hampers Sweet Duo Maher Snack & Cookies',
      },
    ],
    shortDesc: 'Paket 2 varian cookies favorit + kartu ucapan.',
    longDesc:
      'Pilihan ideal untuk ulang tahun dan momen spesial. Kartu ucapan bisa custom.',
    rating: 4.9,
    variants: [
      {
        name: 'Pilihan Varian',
        options: [
          { value: 'cc-rv', label: 'ChocoChip + Red Velvet', price: 185000 },
          { value: 'cc-cs', label: 'ChocoChip + Cheese Stick', price: 185000 },
        ],
      },
    ],
    bestSeller: true,
  },
] as const;

const faqSeeds = [
  {
    question: 'Apakah produk tersedia setiap hari?',
    answer:
      'Ya, dipanggang harian. Untuk paket khusus/hampers disarankan pre-order H-2.',
    sortOrder: 1,
  },
  {
    question: 'Bagaimana cara pesan?',
    answer:
      'Klik tombol “Pesan via WhatsApp” di produk yang diinginkan dan kirim pesan otomatis yang muncul.',
    sortOrder: 2,
  },
  {
    question: 'Berapa lama masa simpan cookies?',
    answer: 'Rata-rata 7–14 hari di suhu ruang sejuk dalam wadah kedap.',
    sortOrder: 3,
  },
  {
    question: 'Apakah bisa custom untuk acara?',
    answer: 'Bisa. Anda dapat menyesuaikan varian, jumlah, dan kartu ucapan.',
    sortOrder: 4,
  },
] as const;

const testimonialSeeds = [
  {
    name: 'Nadia',
    handle: '@nadiafoodie',
    message: 'ChocoChip-nya juara! Renyah luar, chewy dalam.',
    rating: 5,
    source: 'instagram',
    sortOrder: 1,
  },
  {
    name: 'Rafi',
    handle: null,
    message: 'Snack box untuk meeting datang tepat waktu dan rapi.',
    rating: 5,
    source: 'whatsapp',
    sortOrder: 2,
  },
  {
    name: 'Saras',
    handle: '@sarasmakan',
    message: 'Red Velvet Crinkle lembut, manisnya pas.',
    rating: 4,
    source: 'instagram',
    sortOrder: 3,
  },
] as const;

export async function GET() {
  const results = {
    siteCreated: false,
    categoriesCreated: 0,
    productsCreated: 0,
    faqsCreated: 0,
    testimonialsCreated: 0,
  };

  try {
    await prisma.$transaction(async (tx) => {
      const existingSite = await tx.site.findUnique({ where: { id: 1 } });
      if (!existingSite) {
        await tx.site.create({ data: siteSeed });
        results.siteCreated = true;
      }

      for (const category of categorySeeds) {
        const found = await tx.category.findUnique({ where: { id: category.id } });
        if (found) continue;
        await tx.category.create({ data: category });
        results.categoriesCreated += 1;
      }

      for (const product of productSeeds) {
        const found = await tx.product.findUnique({ where: { id: product.id } });
        if (found) continue;
        await tx.product.create({
          data: {
            id: product.id,
            slug: product.slug,
            sku: product.sku,
            name: product.name,
            price: product.price,
            currency: product.currency,
            categoryId: product.categoryId,
            tags: product.tags ?? [],
            shortDesc: product.shortDesc,
            longDesc: product.longDesc,
            rating: product.rating ?? null,
            bestSeller: product.bestSeller ?? false,
            images: {
              create: product.images.map((image, index) => ({
                src: image.src,
                alt: image.alt,
                sortOrder: index,
              })),
            },
            variants: {
              create: (product.variants ?? []).map((variant) => ({
                name: variant.name,
                options: {
                  create: variant.options.map((option) => ({
                    label: option.label,
                    value: option.value ?? null,
                    price: option.price,
                  })),
                },
              })),
            },
          },
        });
        results.productsCreated += 1;
      }

      for (const faq of faqSeeds) {
        const found = await tx.fAQ.findUnique({ where: { question: faq.question } });
        if (found) continue;
        await tx.fAQ.create({ data: faq });
        results.faqsCreated += 1;
      }

      for (const testimonial of testimonialSeeds) {
        const found = await tx.testimonial.findFirst({
          where: { name: testimonial.name, message: testimonial.message },
        });
        if (found) continue;
        await tx.testimonial.create({ data: testimonial });
        results.testimonialsCreated += 1;
      }
    });

    revalidateTag(CACHE_TAGS.site);
    revalidateTag(CACHE_TAGS.categories);
    revalidateTag(CACHE_TAGS.products);
    revalidateTag(CACHE_TAGS.faqs);
    revalidateTag(CACHE_TAGS.testimonials);

    return NextResponse.json({
      message: 'Seeder executed successfully',
      results,
    });
  } catch (error) {
    console.error('Seeder error', error);
    return NextResponse.json(
      { message: 'Seeder execution failed', error: (error as Error).message },
      { status: 500 },
    );
  }
}
