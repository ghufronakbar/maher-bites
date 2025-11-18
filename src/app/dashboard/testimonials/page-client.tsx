'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import type { Testimonial } from '@prisma/client';
import {
  deleteTestimonialAction,
  upsertTestimonialAction,
} from './actions';

const SOURCES = ['instagram', 'tiktok', 'whatsapp', 'google'] as const;

export default function DashboardTestimonialsClientPage({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const addFormRef = useRef<HTMLFormElement>(null);

  const handleUpsert = async (formData: FormData) => {
    const result = await upsertTestimonialAction(formData);
    if (result.success) {
      toast.success(result.message);
      if (!formData.has('id')) {
        addFormRef.current?.reset();
      }
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (formData: FormData) => {
    const result = await deleteTestimonialAction(formData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Testimonial</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sosial proof membantu meningkatkan kepercayaan calon pelanggan.
        </p>
      </header>
      <section className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Tambah Testimonial
        </h2>
        <form
          ref={addFormRef}
          action={handleUpsert}
          className="grid gap-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6 md:grid-cols-2"
        >
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Nama Pelanggan
            <input
              name="name"
              placeholder="mis. Nadia"
              required
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Handle / Username
            <input
              name="handle"
              placeholder="mis. @nadiafoodie"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Rating (1-5)
            <input
              name="rating"
              type="number"
              min={1}
              max={5}
              step={1}
              required
              defaultValue={5}
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Sumber
            <select
              name="source"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="">Pilih sumber</option>
              {SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
            Pesan
            <textarea
              name="message"
              rows={3}
              placeholder="Cerita pelanggan"
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
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            Simpan Testimonial
          </button>
        </form>
      </section>
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Testimonial Aktif
        </h2>
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <form
              key={testimonial.id}
              action={handleUpsert}
              className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:grid-cols-2"
            >
              <input type="hidden" name="id" value={testimonial.id} />
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Nama
                <input
                  name="name"
                  defaultValue={testimonial.name}
                  required
                  className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Handle
                <input
                  name="handle"
                  defaultValue={testimonial.handle ?? ''}
                  className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Rating
                <input
                  name="rating"
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={testimonial.rating}
                  required
                  className="mt-1 w-24 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Sumber
                <select
                  name="source"
                  defaultValue={testimonial.source ?? ''}
                  className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Pilih sumber</option>
                  {SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
                Pesan
                <textarea
                  name="message"
                  rows={3}
                  defaultValue={testimonial.message}
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
                  defaultValue={testimonial.sortOrder ?? 0}
                  className="mt-1 w-24 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <div className="flex items-center gap-3 md:col-span-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  Update
                </button>
                <button
                  formAction={handleDelete}
                  name="id"
                  value={testimonial.id}
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
