import { getFAQs } from '@/data/faqs';
import { deleteFAQAction, upsertFAQAction } from './actions';

interface DashboardFAQsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardFAQsPage({ searchParams }: DashboardFAQsPageProps) {
  const searchParamsData = await searchParams;
  const faqs = await getFAQs();
  const status = Array.isArray(searchParamsData?.status)
    ? searchParamsData?.status[0]
    : searchParamsData?.status;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">FAQ Landing Page</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Konten FAQ membantu pengunjung memahami proses pemesanan.
        </p>
        {status === 'success' ? (
          <p className="mt-4 inline-flex rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            FAQ tersimpan.
          </p>
        ) : null}
        {status === 'deleted' ? (
          <p className="mt-4 inline-flex rounded-full bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
            FAQ dihapus.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="mt-4 inline-flex rounded-full bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
            Gagal memproses FAQ. Coba lagi.
          </p>
        ) : null}
      </header>
      <section className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Tambah FAQ
        </h2>
        <form action={upsertFAQAction} className="space-y-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
              Pertanyaan
              <input
                name="question"
                placeholder="Tulis pertanyaan"
                required
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Urutan
              <input
                name="sortOrder"
                type="number"
                min={0}
                placeholder="mis. 1"
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
          </div>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Jawaban
            <textarea
              name="answer"
              rows={3}
              placeholder="Tulis jawaban"
              required
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            Simpan FAQ
          </button>
        </form>
      </section>
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          FAQ Aktif
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <form
              key={faq.id ?? faq.q}
              action={upsertFAQAction}
              className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
            >
              <input type="hidden" name="id" value={faq.id} />
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Pertanyaan
                <input
                  name="question"
                  defaultValue={faq.q}
                  required
                  className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Jawaban
                <textarea
                  name="answer"
                  rows={3}
                  defaultValue={faq.a}
                  required
                  className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Urutan
                <input
                  name="sortOrder"
                  type="number"
                  min={0}
                  defaultValue={faq.sortOrder ?? index + 1}
                  className="mt-1 w-24 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  Update
                </button>
                <button
                  formAction={deleteFAQAction}
                  name="id"
                  value={faq.id}
                  className="inline-flex items-center justify-center rounded-full border border-red-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
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
