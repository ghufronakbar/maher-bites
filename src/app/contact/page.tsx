import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/container';
import { getSite } from '@/data/site';

export const metadata: Metadata = {
  title: 'Kontak',
  description:
    'Hubungi Maher Bites untuk pemesanan cookies, snack box, dan hampers. Kami siap membantu konsultasi varian, jadwal kirim, dan kebutuhan perusahaan Anda.',
  alternates: {
    canonical: '/contact',
    languages: {
      'id-ID': '/contact',
    },
  },
};

export default async function ContactPage() {
  const site = await getSite();
  return (
    <div className="bg-white py-16">
      <Container className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-zinc-900">Kontak Maher Bites</h1>
          <p className="text-base text-zinc-600">
            Tim kami siap menjawab pertanyaan Anda seputar varian produk, kapasitas produksi,
            pengiriman, hingga kebutuhan custom.
          </p>
          {site.hours ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 text-sm text-emerald-800">
              <h2 className="text-lg font-semibold text-emerald-900">Jam operasional</h2>
              <p className="mt-2">{site.hours}</p>
            </div>
          ) : null}
        </div>
        <div className="space-y-4 rounded-3xl border border-amber-100 bg-amber-50/70 p-6 text-sm text-zinc-700">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">WhatsApp</h3>
            <a
              href={site.whatsapp}
              className="mt-1 inline-flex items-center text-emerald-600 transition hover:text-emerald-700"
            >
              {site.whatsapp.replace('https://', '')}
            </a>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Email</h3>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 inline-flex items-center text-emerald-600 transition hover:text-emerald-700"
            >
              {site.email}
            </a>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Telepon</h3>
            <a
              href={`tel:${site.phone}`}
              className="mt-1 inline-flex items-center text-emerald-600 transition hover:text-emerald-700"
            >
              {site.phone}
            </a>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Alamat Produksi</h3>
            <p className="mt-1">{site.address}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Sosial</h3>
            <ul className="mt-2 space-y-1">
              {site.social.instagram && (
                <li>
                  <Link
                    href={site.social.instagram}
                    className="text-emerald-600 transition hover:text-emerald-700"
                  >
                    Instagram
                  </Link>
                </li>
              )}
              {site.social.tiktok && (
                <li>
                  <Link
                    href={site.social.tiktok}
                    className="text-emerald-600 transition hover:text-emerald-700"
                  >
                    TikTok
                  </Link>
                </li>
              )}
              {site.social.facebook && (
                <li>
                  <Link
                    href={site.social.facebook}
                    className="text-emerald-600 transition hover:text-emerald-700"
                  >
                    Facebook
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
