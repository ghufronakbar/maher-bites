import { getAllCategories } from '@/data/categories';
import { deleteCategoryAction, upsertCategoryAction } from './actions';

interface CategoriesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardCategoriesPage({ searchParams }: CategoriesPageProps) {
  const searchParamsData = await searchParams;
  const categories = await getAllCategories();
  const status = Array.isArray(searchParamsData?.status)
    ? searchParamsData?.status[0]
    : searchParamsData?.status;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Kategori Produk</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Kategori digunakan untuk memfilter produk di katalog publik.
        </p>
        {status === 'success' ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Kategori berhasil disimpan.
          </p>
        ) : null}
        {status === 'deleted' ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Kategori dihapus.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Terjadi kesalahan. Pastikan semua field terisi.
          </p>
        ) : null}
      </header>
      <section className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Tambah Kategori
        </h2>
        <form action={upsertCategoryAction} className="grid gap-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            ID
            <input
              name="id"
              required
              placeholder="mis. cookies"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Slug
            <input
              name="slug"
              required
              placeholder="mis. cookies"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
            Nama
            <input
              name="name"
              required
              placeholder="Nama kategori"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
            Deskripsi
            <textarea
              name="description"
              rows={2}
              placeholder="Deskripsi singkat"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            Simpan Kategori
          </button>
        </form>
      </section>
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Kategori Saat Ini
        </h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <form
              key={category.id}
              action={upsertCategoryAction}
              className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:grid-cols-2"
            >
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                ID
                <input
                  name="id"
                  defaultValue={category.id}
                  readOnly
                  className="mt-1 rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm text-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Slug
                <input
                  name="slug"
                  defaultValue={category.slug}
                  required
                  className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
                Nama
                <input
                  name="name"
                  defaultValue={category.name}
                  required
                  className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
                Deskripsi
                <textarea
                  name="description"
                  defaultValue={category.description ?? ''}
                  rows={2}
                  className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <div className="flex items-center gap-3 md:col-span-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  Update
                </button>
                <button
                  formAction={deleteCategoryAction}
                  type="submit"
                  name="id"
                  value={category.id}
                  className="inline-flex items-center justify-center rounded-full border border-red-200 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                >
                  Hapus
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
