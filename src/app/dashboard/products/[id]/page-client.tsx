'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { ImageFields } from './image-fields';
import { VariantFields } from './variant-fields';
import { upsertProductAction, deleteProductAction } from '../actions';
import type { Category } from '@prisma/client';
import { isImageArray, isVariantArray } from './types';
import type { ProductRecord } from '@/data/products';

export default function DashboardProductDetailClientPage({
  product,
  categories,
  isNew,
}: {
  product?: ProductRecord;
  categories: Category[];
  isNew: boolean;
}) {
  const initialProduct = product ?? {
    id: '',
    slug: '',
    sku: null,
    name: '',
    price: 0,
    currency: 'IDR',
    categoryId: categories[0]?.id ?? '',
    tags: [],
    shortDesc: '',
    longDesc: '',
    rating: null,
    weightGram: null,
    ingredients: [],
    allergens: [],
    shelfLifeDays: null,
    storage: null,
    variants: [],
    images: [],
    bestSeller: false,
  };

  const images = isImageArray(initialProduct.images)
    ? initialProduct.images
    : [];
  const variants = isVariantArray(initialProduct.variants)
    ? initialProduct.variants
    : [];

  const handleUpsert = async (formData: FormData) => {
    const result = await upsertProductAction(formData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (formData: FormData) => {
    const result = await deleteProductAction(formData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            {isNew ? 'Produk Baru' : `Edit Produk: ${initialProduct.name}`}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Lengkapi informasi berikut agar produk tampil optimal di katalog.
          </p>
        </div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-600"
        >
          ← Kembali
        </Link>
      </header>
      <form action={handleUpsert} className="space-y-8">
        <input
          type="hidden"
          name="redirectTo"
          value="/dashboard/products/{id}"
        />
        <section className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            ID Produk
            <input
              name="id"
              required
              defaultValue={isNew ? '' : initialProduct.id}
              placeholder="mis. chocochip-classic"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Slug URL
            <input
              name="slug"
              required
              defaultValue={initialProduct.slug}
              placeholder="mis. chocochip-classic"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            SKU
            <input
              name="sku"
              defaultValue={initialProduct.sku ?? ''}
              placeholder="mis. MB-CK-01"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Nama Produk
            <input
              name="name"
              required
              defaultValue={initialProduct.name}
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Harga (IDR)
            <input
              name="price"
              type="number"
              required
              defaultValue={initialProduct.price}
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Kategori
            <select
              name="categoryId"
              defaultValue={initialProduct.categoryId}
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <input
              type="checkbox"
              name="bestSeller"
              defaultChecked={initialProduct.bestSeller}
              className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            Tandai sebagai Best Seller
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Rating (opsional)
            <input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              defaultValue={initialProduct.rating ?? ''}
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Berat (gram)
            <input
              name="weightGram"
              type="number"
              defaultValue={initialProduct.weightGram ?? ''}
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Masa simpan (hari)
            <input
              name="shelfLifeDays"
              type="number"
              defaultValue={initialProduct.shelfLifeDays ?? ''}
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </section>
        <section className="grid gap-4">
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Deskripsi singkat
            <textarea
              name="shortDesc"
              rows={3}
              required
              defaultValue={initialProduct.shortDesc}
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Deskripsi panjang
            <textarea
              name="longDesc"
              rows={4}
              required
              defaultValue={initialProduct.longDesc}
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Tags (pisahkan koma)
            <input
              name="tags"
              defaultValue={
                Array.isArray(initialProduct.tags)
                  ? initialProduct.tags.join(', ')
                  : ''
              }
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Bahan (pisahkan koma)
            <input
              name="ingredients"
              defaultValue={
                Array.isArray(initialProduct.ingredients)
                  ? initialProduct.ingredients.join(', ')
                  : ''
              }
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Alergen (pisahkan koma)
            <input
              name="allergens"
              defaultValue={
                Array.isArray(initialProduct.allergens)
                  ? initialProduct.allergens.join(', ')
                  : ''
              }
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
            Penyimpanan
            <input
              name="storage"
              defaultValue={initialProduct.storage ?? ''}
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </section>
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Galeri Produk
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Atur urutan gambar, isi alt text untuk aksesibilitas, dan unggah
              langsung ke Cloudinary atau tempel URL.
            </p>
          </div>
          <ImageFields name="images" initialImages={images} />
        </section>
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Variasi Produk
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Tambahkan varian seperti ukuran, rasa, atau paket dengan harga
              masing-masing.
            </p>
          </div>
          <VariantFields name="variants" initialVariants={variants} />
        </section>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          Simpan Produk
        </button>
      </form>
      {!isNew && (
        <form action={handleDelete} className="pt-2">
          <input type="hidden" name="id" value={initialProduct.id} />
          <input
            type="hidden"
            name="redirectTo"
            value="/dashboard/products"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Hapus Produk
          </button>
        </form>
      )}
    </div>
  );
}
