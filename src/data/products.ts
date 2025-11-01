import { Prisma } from '@prisma/client';
import type { Product as ProductDTO, VariantOption } from './schema';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, revalidateTag, withCache } from '@/lib/cache';

const productWithRelations = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    images: {
      orderBy: { sortOrder: 'asc' },
    },
    variants: {
      orderBy: { id: 'asc' },
      include: {
        options: {
          orderBy: { id: 'asc' },
        },
      },
    },
  },
});

type ProductRecord = Prisma.ProductGetPayload<typeof productWithRelations>;

const fetchProductRecords = withCache<[], ProductRecord[]>(
  async () =>
    prisma.product.findMany({
      orderBy: { name: 'asc' },
      ...productWithRelations,
    }),
  { key: ['products', 'all'], tags: [CACHE_TAGS.products], revalidate: false },
);

function toStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  return undefined;
}

function mapProduct(record: ProductRecord): ProductDTO {
  const variants =
    record.variants?.length > 0
      ? record.variants.map((variant) => ({
          name: variant.name,
          options: variant.options.map((option): VariantOption => ({
            id: option.value ?? String(option.id),
            label: option.label,
            price: option.price,
          })),
        }))
      : undefined;

  return {
    id: record.id,
    slug: record.slug,
    sku: record.sku ?? undefined,
    name: record.name,
    price: record.price,
    currency: record.currency as ProductDTO['currency'],
    categoryId: record.categoryId,
    tags: toStringArray(record.tags) ?? [],
    images: record.images.map((image) => ({
      src: image.src,
      alt: image.alt,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
    })),
    shortDesc: record.shortDesc,
    longDesc: record.longDesc,
    rating: record.rating ?? undefined,
    weightGram: record.weightGram ?? undefined,
    ingredients: toStringArray(record.ingredients),
    allergens: toStringArray(record.allergens),
    shelfLifeDays: record.shelfLifeDays ?? undefined,
    storage: record.storage ?? undefined,
    variants,
    bestSeller: record.bestSeller ?? undefined,
  };
}

export async function getAllProducts(): Promise<ProductDTO[]> {
  const products = await fetchProductRecords();
  return products.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | undefined> {
  const products = await fetchProductRecords();
  return products.map(mapProduct).find((product) => product.slug === slug);
}

export async function getProductsByCategoryId(categoryId: string) {
  const products = await fetchProductRecords();
  return products.map(mapProduct).filter((product) => product.categoryId === categoryId);
}

export async function searchProducts(query: string) {
  const normalized = query.toLowerCase();
  const products = await fetchProductRecords();
  return products
    .map(mapProduct)
    .filter((product) => {
      if (product.name.toLowerCase().includes(normalized)) return true;
      if (product.shortDesc.toLowerCase().includes(normalized)) return true;
      return product.tags.some((tag) => tag.toLowerCase().includes(normalized));
    });
}

export async function getBestSellers(limit = 8) {
  const products = await fetchProductRecords();
  return products
    .map(mapProduct)
    .filter((product) => product.bestSeller)
    .slice(0, limit);
}

interface ProductInput {
  id: string;
  slug: string;
  sku?: string | null;
  name: string;
  price: number;
  currency: ProductDTO['currency'];
  categoryId: string;
  tags?: string[];
  shortDesc: string;
  longDesc: string;
  rating?: number | null;
  weightGram?: number | null;
  ingredients?: string[];
  allergens?: string[];
  shelfLifeDays?: number | null;
  storage?: string | null;
  bestSeller?: boolean;
  images: Array<{
    id?: number;
    src: string;
    alt: string;
    width?: number | null;
    height?: number | null;
    sortOrder?: number | null;
  }>;
  variants?: Array<{
    id?: number;
    name: string;
    options: Array<{
      id?: number;
      label: string;
      value?: string | null;
      price: number;
    }>;
  }>;
}

export async function upsertProduct(input: ProductInput) {
  const product = await prisma.product.upsert({
    where: { id: input.id },
    create: {
      id: input.id,
      slug: input.slug,
      sku: input.sku ?? null,
      name: input.name,
      price: input.price,
      currency: input.currency,
      categoryId: input.categoryId,
      tags: input.tags ?? [],
      shortDesc: input.shortDesc,
      longDesc: input.longDesc,
      rating: input.rating ?? null,
      weightGram: input.weightGram ?? null,
      ingredients: input.ingredients ?? [],
      allergens: input.allergens ?? [],
      shelfLifeDays: input.shelfLifeDays ?? null,
      storage: input.storage ?? null,
      bestSeller: input.bestSeller ?? false,
      images: {
        create: input.images.map((image, index) => ({
          src: image.src,
          alt: image.alt,
          width: image.width ?? null,
          height: image.height ?? null,
          sortOrder: image.sortOrder ?? index,
        })),
      },
      variants: {
        create: input.variants?.map((variant) => ({
          name: variant.name,
          options: {
            create: variant.options.map((option) => ({
              label: option.label,
              value: option.value ?? null,
              price: option.price,
            })),
          },
        })) ?? [],
      },
    },
    update: {
      slug: input.slug,
      sku: input.sku ?? null,
      name: input.name,
      price: input.price,
      currency: input.currency,
      categoryId: input.categoryId,
      tags: input.tags ?? [],
      shortDesc: input.shortDesc,
      longDesc: input.longDesc,
      rating: input.rating ?? null,
      weightGram: input.weightGram ?? null,
      ingredients: input.ingredients ?? [],
      allergens: input.allergens ?? [],
      shelfLifeDays: input.shelfLifeDays ?? null,
      storage: input.storage ?? null,
      bestSeller: input.bestSeller ?? false,
      images: {
        deleteMany: { productId: input.id },
        create: input.images.map((image, index) => ({
          src: image.src,
          alt: image.alt,
          width: image.width ?? null,
          height: image.height ?? null,
          sortOrder: image.sortOrder ?? index,
        })),
      },
      variants: {
        deleteMany: { productId: input.id },
        create: input.variants?.map((variant) => ({
          name: variant.name,
          options: {
            create: variant.options.map((option) => ({
              label: option.label,
              value: option.value ?? null,
              price: option.price,
            })),
          },
        })) ?? [],
      },
    },
    ...productWithRelations,
  });

  revalidateTag(CACHE_TAGS.products);
  return mapProduct(product);
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.products);
}

export type { ProductRecord };
