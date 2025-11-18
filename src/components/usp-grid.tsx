import { Container } from '@/components/container';

const USPS = [
  { title: 'Bahan Premium', description: 'Butter asli, cokelat Belgia, dan bahan pilihan.' },
  { title: 'Halal*', description: 'Diproses bersih & higienis. Sedang dalam tahap sertifikasi.' },
  { title: 'Fresh Baked', description: 'Dipanggang setelah ada pesanan, bukan stok lama.' },
  { title: 'Delivery Cepat', description: 'Antar instan area Jabodetabek, kirim luar kota via ekspedisi.' },
] as const;

export function USPGrid() {
  return (
    <section aria-labelledby="usp-heading" className="border-y border-amber-100 bg-white py-14">
      <Container>
        <h2 id="usp-heading" className="text-center text-2xl font-semibold text-zinc-900">
          Kenapa Pilih Maher Snack & Cookies?
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {USPS.map((usp) => (
            <div
              key={usp.title}
              className="rounded-2xl border border-amber-100 bg-amber-50/60 p-6 text-center shadow-sm"
            >
              <h3 className="text-lg font-semibold text-zinc-900">{usp.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{usp.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
