'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/container';
import { trackWAEvent } from '@/lib/analytics';
import { Site } from '@prisma/client';

interface HeroSectionProps {
  site: Site;
}

export function HeroSection({ site }: HeroSectionProps) {
  const waUrl = `${site.whatsapp}?text=${encodeURIComponent(
    'Halo Maher Snack & Cookies, saya mau pesan camilan fresh-baked.',
  )}`;

  return (
    <section className="bg-gradient-to-b from-amber-50 via-white to-white">
      <Container className="flex flex-col items-center gap-10 py-16 lg:flex-row lg:py-24">
        <div className="w-full lg:w-1/2">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Fresh baked setiap hari
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Camilan Manis, Bikin Hati Habis
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            Cookies chewy, snack box gurih, dan hampers cantik siap antar cepat
            area Jabodetabek. Semua dengan bahan premium dan rasa rumahan yang
            tulus.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href={waUrl}
              onClick={() =>
                trackWAEvent({ source: 'hero_primary', product: 'general' })
              }
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              Pesan via WhatsApp
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-base font-semibold text-zinc-700 transition hover:border-emerald-500 hover:text-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              Lihat Katalog
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Gratis kartu ucapan &amp; bisa custom untuk acara spesial.
          </p>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-amber-100 bg-amber-50 shadow-lg">
            <Image
              src={site.ogImage}
              alt="Cookies Maher Snack & Cookies tersusun di piring kayu"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-700 backdrop-blur">
              Dipanggang &amp; dikemas harian
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
