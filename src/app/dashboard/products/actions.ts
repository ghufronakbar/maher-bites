'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteProduct, upsertProduct } from '@/data/products';

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

export async function upsertProductAction(formData: FormData) {
  const id = formData.get('id')?.toString().trim();
  const redirectTemplate = formData.get('redirectTo')?.toString().trim() ?? '';

  if (!id) {
    redirect(`${redirectTemplate}?status=error`);
  }

  try {
    const name = formData.get('name')?.toString().trim() ?? '';

    const images = parseJsonArray<Array<{ src: string; alt: string; width?: number; height?: number }>>(
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

    await upsertProduct({
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
    });

    revalidatePath('/dashboard/products');
    revalidatePath(`/dashboard/products/${id}`);
    const targetPath = redirectTemplate
      ? redirectTemplate.replace('{id}', id)
      : `/dashboard/products/${id}`;
    redirect(`${targetPath}?status=success&id=${encodeURIComponent(id)}`);
  } catch (error) {
    console.error('upsertProductAction error', error);
    const targetPath = redirectTemplate
      ? redirectTemplate.replace('{id}', id)
      : `/dashboard/products/${id}`;
    redirect(`${targetPath}?status=error&id=${encodeURIComponent(id)}`);
  }
}

export async function deleteProductAction(formData: FormData) {
  const id = formData.get('id')?.toString();
  const redirectTo = formData.get('redirectTo')?.toString() ?? '/dashboard/products';

  if (!id) {
    redirect(`${redirectTo}?status=error`);
  }

  try {
    await deleteProduct(id);
    revalidatePath('/dashboard/products');
    redirect(`${redirectTo}?status=deleted`);
  } catch (error) {
    console.error('deleteProductAction error', error);
    redirect(`${redirectTo}?status=error`);
  }
}
