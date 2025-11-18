'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { deleteProduct, upsertProduct } from '@/data/products';

const UpsertProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  sku: z.string().nullable(),
  name: z.string(),
  price: z.number(),
  currency: z.enum(['IDR']),
  categoryId: z.string(),
  tags: z.array(z.string()),
  shortDesc: z.string(),
  longDesc: z.string(),
  rating: z.number().nullable(),
  weightGram: z.number().nullable(),
  ingredients: z.array(z.string()),
  allergens: z.array(z.string()),
  shelfLifeDays: z.number().nullable(),
  storage: z.string().nullable(),
  bestSeller: z.boolean(),
  images: z.array(
    z.object({
      src: z.string(),
      alt: z.string(),
      width: z.number().nullable(),
      height: z.number().nullable(),
      sortOrder: z.number(),
    }),
  ),
  variants: z.array(
    z.object({
      name: z.string(),
      options: z.array(
        z.object({
          label: z.string(),
          price: z.number(),
          value: z.string().nullable(),
        }),
      ),
    }),
  ),
});

type ActionResponse = {
  success: boolean;
  message: string;
};

function parseJsonArray<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as T;
    return parsed ?? fallback;
  } catch (error) {
    console.error('JSON parse error', error);
    return fallback;
  }
}

function toNumber(value: FormDataEntryValue | null) {
  if (value === null) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function toStringArray(value: FormDataEntryValue | null) {
  if (!value) return [];
  return value
    .toString()
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function upsertProductAction(
  formData: FormData,
): Promise<ActionResponse> {
  const id = formData.get('id')?.toString().trim();
  if (!id) {
    return {
      success: false,
      message: 'Gagal menyimpan produk, ID tidak ditemukan',
    };
  }

  const name = formData.get('name')?.toString().trim() ?? '';
  const images = parseJsonArray<
    Array<{ src: string; alt: string; width?: number; height?: number }>
  >(
    formData.get('images')?.toString() ?? null,
    [],
  ).map((image, index) => ({
    src: image.src,
    alt: image.alt,
    width: image.width ?? null,
    height: image.height ?? null,
    sortOrder: index,
  }));

  const safeImages =
    images.length > 0
      ? images
      : [
          {
            src: '/images/placeholder-product.svg',
            alt: name ? `${name} image` : 'Placeholder Maher Bites',
            width: null,
            height: null,
            sortOrder: 0,
          },
        ];

  const variants = parseJsonArray<
    Array<{
      name: string;
      options: Array<{ label: string; price: number; value?: string | null }>;
    }>
  >(formData.get('variants')?.toString() ?? null, []).map((variant) => ({
    name: variant.name,
    options: variant.options.map((option) => ({
      label: option.label,
      price: option.price,
      value: option.value ?? null,
    })),
  }));

  const data = {
    id,
    slug: formData.get('slug')?.toString().trim() ?? id,
    sku: formData.get('sku')?.toString().trim() ?? null,
    name,
    price: Number(formData.get('price') ?? 0),
    currency: (formData.get('currency')?.toString() ?? 'IDR') as 'IDR',
    categoryId: formData.get('categoryId')?.toString() ?? '',
    tags: toStringArray(formData.get('tags')),
    shortDesc: formData.get('shortDesc')?.toString() ?? '',
    longDesc: formData.get('longDesc')?.toString() ?? '',
    rating: toNumber(formData.get('rating')) ?? null,
    weightGram: toNumber(formData.get('weightGram')) ?? null,
    ingredients: toStringArray(formData.get('ingredients')),
    allergens: toStringArray(formData.get('allergens')),
    shelfLifeDays: toNumber(formData.get('shelfLifeDays')) ?? null,
    storage: formData.get('storage')?.toString() ?? null,
    bestSeller: formData.get('bestSeller') === 'on',
    images: safeImages,
    variants,
  };

  const parsed = UpsertProductSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Gagal menyimpan produk, data tidak valid',
    };
  }

  try {
    await upsertProduct(parsed.data);
    revalidatePath('/dashboard/products');
    revalidatePath(`/dashboard/products/${id}`);
    return {
      success: true,
      message: 'Produk berhasil disimpan',
    };
  } catch (error) {
    console.error('upsertProductAction error', error);
    return {
      success: false,
      message: 'Gagal menyimpan produk',
    };
  }
}

export async function deleteProductAction(
  formData: FormData,
): Promise<ActionResponse> {
  const id = formData.get('id')?.toString();
  if (!id) {
    return {
      success: false,
      message: 'Gagal menghapus produk, ID tidak ditemukan',
    };
  }

  try {
    await deleteProduct(id);
    revalidatePath('/dashboard/products');
    return {
      success: true,
      message: 'Produk berhasil dihapus',
    };
  } catch (error) {
    console.error('deleteProductAction error', error);
    return {
      success: false,
      message: 'Gagal menghapus produk',
    };
  }
}
