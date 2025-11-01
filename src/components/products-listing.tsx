'use client';

import { useMemo, useState } from 'react';
import type { Category, Product } from '@/data/schema';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/product-card';

interface ProductsListingProps {
  products: Product[];
  categories: Category[];
  initialCategoryId?: string;
  whatsappUrl: string;
}

export function ProductsListing({
  products,
  categories,
  initialCategoryId,
  whatsappUrl,
}: ProductsListingProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategoryId ?? null,
  );

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((product) => product.categoryId === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500',
              !activeCategory
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400',
            )}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500',
                activeCategory === category.id
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400',
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-zinc-500">
          {filteredProducts.length} produk{' '}
          {activeCategory
            ? `dalam kategori ${categories.find((c) => c.id === activeCategory)?.name ?? ''}`
            : 'tersedia'}
        </p>
      </div>
      {filteredProducts.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} whatsappUrl={whatsappUrl} />
          ))}
        </div>
      ) : (
        <p className="rounded-3xl border border-amber-100 bg-amber-50/70 p-8 text-center text-sm text-zinc-600">
          Belum ada produk pada kategori ini. Silakan pilih kategori lain atau hubungi kami untuk
          custom order.
        </p>
      )}
    </div>
  );
}
