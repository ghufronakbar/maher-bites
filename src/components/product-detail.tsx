'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { createWAOrderLink } from '@/data/wa';
import type { Product, VariantOption } from '@/data/schema';
import { trackWAEvent } from '@/lib/analytics';
import { formatCurrency } from '@/lib/utils';

interface ProductDetailProps {
  product: Product;
  whatsappUrl: string;
}

export function ProductDetail({ product, whatsappUrl }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(
    product.variants?.[0]?.options?.[0] ?? null,
  );
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  const activePrice = useMemo(() => {
    if (selectedVariant) return selectedVariant.price;
    return product.price;
  }, [product.price, selectedVariant]);

  const heroImage = product.images[0];
  const restImages = product.images.slice(1);

  const waLink = useMemo(() => {
    return createWAOrderLink({
      product,
      whatsappUrl,
      qty,
      variantOptionLabel: selectedVariant?.label,
      note: note.trim() ? note.trim() : undefined,
    });
  }, [note, product, qty, selectedVariant, whatsappUrl]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr]">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-amber-100 bg-amber-50 shadow">
          <Image
            src={heroImage?.src ?? '/images/placeholder-product.svg'}
            alt={heroImage?.alt ?? product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        {restImages.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {restImages.map((image) => (
              <div key={image.src} className="relative aspect-square overflow-hidden rounded-2xl border border-amber-100">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 33vw, 15vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-6 rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
            {product.tags.join(' • ')}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">{product.name}</h1>
          <p className="mt-3 text-base text-zinc-600">{product.longDesc}</p>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Harga
            </span>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              {formatCurrency(activePrice, product.currency)}
            </p>
          </div>
          {product.variants?.length ? (
            <div>
              <label className="block text-sm font-semibold text-zinc-700">
                Pilih Varian
              </label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.variants[0].options.map((option) => {
                  const checked = selectedVariant?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedVariant(option)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                        checked
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400'
                      }`}
                    >
                      <span>{option.label}</span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        {formatCurrency(option.price, product.currency)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm font-semibold text-zinc-700">
              Jumlah (pcs)
              <input
                min={1}
                value={qty}
                onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))}
                type="number"
                className="mt-2 rounded-xl border border-zinc-200 px-3 py-2 text-base text-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-semibold text-zinc-700">
              Catatan (opsional)
              <input
                value={note}
                onChange={(event) => setNote(event.target.value)}
                type="text"
                placeholder="Misal: kartu ucapan, tanggal kirim"
                className="mt-2 rounded-xl border border-zinc-200 px-3 py-2 text-base text-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
          </div>
        </div>
        <a
          href={waLink}
          onClick={() =>
            trackWAEvent({
              source: 'product_detail',
              product: product.slug,
              variant: selectedVariant?.id ?? 'default',
              qty,
            })
          }
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          Pesan via WhatsApp
        </a>
        <div className="space-y-3 rounded-2xl bg-amber-50/80 p-5 text-sm text-zinc-600">
          {product.ingredients ? (
            <p>
              <span className="font-semibold text-zinc-800">Bahan:</span> {product.ingredients.join(', ')}
            </p>
          ) : null}
          {product.allergens ? (
            <p>
              <span className="font-semibold text-zinc-800">Alergen:</span> {product.allergens.join(', ')}
            </p>
          ) : null}
          {product.storage ? (
            <p>
              <span className="font-semibold text-zinc-800">Penyimpanan:</span> {product.storage}
            </p>
          ) : null}
          {product.shelfLifeDays ? (
            <p>
              <span className="font-semibold text-zinc-800">Masa simpan:</span> ± {product.shelfLifeDays} hari
            </p>
          ) : null}
          {product.weightGram ? (
            <p>
              <span className="font-semibold text-zinc-800">Berat bersih:</span> {product.weightGram} gram
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
