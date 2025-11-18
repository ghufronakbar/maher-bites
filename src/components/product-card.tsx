'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ProductRecord as Product } from '@/data/products';
import { createWAOrderLink } from '@/data/wa';
import { trackWAEvent } from '@/lib/analytics';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  displayCategoryLink?: boolean;
  whatsappUrl: string;
}

export function ProductCard({
  product,
  displayCategoryLink = false,
  whatsappUrl,
}: ProductCardProps) {
  const waUrl = createWAOrderLink({ product, whatsappUrl });

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square">
        <Image
          src={product.images[0]?.src ?? '/images/placeholder-product.svg'}
          alt={product.images[0]?.alt ?? product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        {product.bestSeller && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-emerald-500/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
            Best Seller
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-zinc-500">{product.shortDesc}</p>
        </div>
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-zinc-900">
            <span>{formatCurrency(product.price, product.currency as 'IDR')}</span>
            {product.rating ? (
              <span aria-label={`Rating ${product.rating} dari 5`} className="flex items-center gap-1 text-amber-500">
                ★ {product.rating.toFixed(1)}
              </span>
            ) : null}
          </div>
          {displayCategoryLink ? (
            <Link
              href={`/products?category=${product.categoryId}`}
              className="text-xs font-medium text-emerald-600 transition hover:text-emerald-700"
            >
              Lihat kategori
            </Link>
          ) : null}
          <a
            href={waUrl}
            onClick={() => trackWAEvent({ source: 'product_card', product: product.slug })}
            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            Pesan via WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
