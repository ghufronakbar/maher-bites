import Link from 'next/link';
import { getAllProducts } from '@/data/products';
import { getSite } from '@/data/site';

export default async function DashboardHomePage() {
  const [site, products] = await Promise.all([getSite(), getAllProducts()]);

  const stats = [
    { label: 'Total Produk', value: products.length, href: '/dashboard/products' },
    {
      label: 'Best Seller',
      value: products.filter((product) => product.bestSeller).length,
      href: '/dashboard/products?filter=best-seller',
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Halo, tim {site.name}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Gunakan dashboard ini untuk memperbarui informasi toko, katalog produk, dan konten pendukung.
        </p>
      </header>
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Statistik Singkat
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href ?? '#'}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-6 transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {stat.label}
              </span>
              <span className="mt-2 text-3xl font-semibold text-zinc-900">{stat.value}</span>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Aksi Cepat
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/products/new"
            className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-6 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-100"
          >
            + Tambah produk baru
          </Link>
          <Link
            href="/dashboard/site"
            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm font-semibold text-zinc-700 transition hover:border-emerald-400 hover:bg-emerald-50"
          >
            Update informasi toko
          </Link>
        </div>
      </section>
    </div>
  );
}
