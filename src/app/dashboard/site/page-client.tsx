'use client';

import { toast } from 'sonner';
import { ImageUrlInput } from '@/components/dashboard/image-url-input';
import { updateSiteAction } from './actions';
import type { Site } from '@prisma/client';
import type { SEOConfig as SEO } from '@/data/schema';

export default function DashboardSiteClientPage({
  site,
  seo,
}: {
  site: Site;
  seo: SEO;
}) {
  const handleUpdate = async (formData: FormData) => {
    const result = await updateSiteAction(formData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Informasi Toko</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Perbarui detail kontak, jam operasional, dan metadata SEO utama. Hanya
          satu entri toko yang digunakan.
        </p>
      </header>
      <form action={handleUpdate} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Profil Brand
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Nama Brand
              <input
                name="name"
                defaultValue={site.name}
                required
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Domain
              <input
                name="domain"
                defaultValue={site.domain}
                required
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Locale
              <input
                name="locale"
                defaultValue={site.locale}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Alamat
              <input
                name="address"
                defaultValue={site.address}
                required
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Jam Operasional
              <input
                name="hours"
                defaultValue={site.hours ?? ''}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <div className="md:col-span-2">
              <ImageUrlInput
                name="logoLight"
                label="Logo (light)"
                defaultValue={site.logoLight}
                required
                helperText="Unggah logo versi background terang."
              />
            </div>
            <div className="md:col-span-2">
              <ImageUrlInput
                name="logoDark"
                label="Logo (dark)"
                defaultValue={site.logoDark}
                required
                helperText="Unggah logo versi background gelap."
              />
            </div>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Kontak
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              WhatsApp URL
              <input
                name="whatsapp"
                defaultValue={site.whatsapp}
                required
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Email
              <input
                name="email"
                type="email"
                defaultValue={site.email}
                required
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Telepon
              <input
                name="phone"
                defaultValue={site.phone}
                required
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Instagram
              <input
                name="instagram"
                defaultValue={site.instagram ?? ''}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              TikTok
              <input
                name="tiktok"
                defaultValue={site.tiktok ?? ''}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Facebook
              <input
                name="facebook"
                defaultValue={site.facebook ?? ''}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            SEO & Meta
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
              Default Title
              <input
                name="defaultTitle"
                defaultValue={seo.defaultTitle}
                required
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
              Default Description
              <textarea
                name="defaultDescription"
                defaultValue={seo.defaultDescription}
                required
                rows={4}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
              Keywords (pisahkan dengan koma)
              <textarea
                name="keywords"
                defaultValue={seo.keywords.join(', ')}
                rows={3}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <div className="md:col-span-2">
              <ImageUrlInput
                name="ogImage"
                label="OG Image"
                defaultValue={seo.ogImage}
                required
                helperText="Direkomendasikan 1200x630px."
              />
            </div>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Twitter Handle
              <input
                name="twitterHandle"
                defaultValue={seo.twitterHandle ?? ''}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
          </div>
        </section>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          Simpan perubahan
        </button>
      </form>
    </div>
  );
}
