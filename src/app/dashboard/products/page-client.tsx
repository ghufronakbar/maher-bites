'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { deleteProductAction } from './actions';
import type { Category, Product } from '@prisma/client';

export default function DashboardProductsPage({
  products,
  categories,
  filter,
}: {
  products: Product[];
  categories: Category[];
  filter?: string;
}) {
  const filteredProducts =
    filter === 'best-seller'
      ? products.filter((product) => product.bestSeller)
      : products;

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
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Produk</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Kelola katalog produk, harga, dan badge best seller.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          + Produk Baru
        </Link>
      </header>
      <section className="space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-zinc-200">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 text-left">Produk</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Harga</th>
                <th className="px-4 py-3 text-left">Best Seller</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="bg-white">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-zinc-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-zinc-500">{product.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {categories.find(
                      (category) => category.id === product.categoryId,
                    )?.name ?? '–'}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {formatCurrency(product.price, product.currency as 'IDR')}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {product.bestSeller ? (
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Ya
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500">
                        Tidak
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="text-xs font-semibold uppercase tracking-wide text-emerald-600 transition hover:text-emerald-700"
                      >
                        Edit
                      </Link>
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={product.id} />
                        <input
                          type="hidden"
                          name="redirectTo"
                          value="/dashboard/products"
                        />
                        <button
                          type="submit"
                          className="text-xs font-semibold uppercase tracking-wide text-red-500 transition hover:text-red-600"
                        >
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            Belum ada produk pada filter ini.
          </p>
        ) : null}
      </section>
    </div>
  );
}
