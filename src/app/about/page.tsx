import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { getSite } from '@/data/site';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description:
    'Kenali Maher Bites: bakery rumahan yang fokus menyajikan cookies premium, snack box praktis, dan hampers cantik dengan rasa tulus.',
  alternates: {
    canonical: '/about',
    languages: {
      'id-ID': '/about',
    },
  },
};

export default async function AboutPage() {
  const site = await getSite();
  return (
    <div className="bg-white py-16">
      <Container className="space-y-8">
        <header className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Tentang {site.name}
          </p>
          <h1 className="text-3xl font-bold text-zinc-900">
            Cerita kami dimulai dari dapur keluarga
          </h1>
          <p className="text-base text-zinc-600">
            Maher Bites lahir dari kecintaan kami pada baking dan momen berbagi. Setiap batch
            dibuat dalam porsi kecil supaya kualitas rasa dan tekstur selalu konsisten—renyah di luar,
            lembut di dalam.
          </p>
        </header>
        <section className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-6 text-sm text-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900">Apa yang membuat kami berbeda</h2>
            <ul className="mt-4 list-inside list-disc space-y-2">
              <li>Bahan premium: butter Eropa, cokelat Belgia, telur segar.</li>
              <li>Dipanggang harian berdasarkan pesanan.</li>
              <li>Tim kecil yang gesit menjawab kebutuhan korporat maupun personal.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900">Misi kami</h2>
            <p className="mt-2">
              Kami ingin setiap gigitan membawa rasa hangat rumah. Untuk itu kami berkomitmen pada
              kualitas bahan, pelayanan ramah, dan pengiriman tepat waktu.
            </p>
            <p className="mt-4">
              Tim Maher Bites siap membantu merancang hampers, snack box, hingga paket custom untuk
              event perusahaan Anda.
            </p>
          </div>
        </section>
      </Container>
    </div>
  );
}
