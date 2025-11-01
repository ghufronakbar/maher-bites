import { getSEOConfig, getSite } from "@/data/site";
import { ImageUrlInput } from "@/components/dashboard/image-url-input";
import { updateSiteAction } from "./actions";

interface SitePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardSitePage({
  searchParams,
}: SitePageProps) {
  const searchParamsData = await searchParams;
  const [site, seo] = await Promise.all([getSite(), getSEOConfig()]);
  const status = Array.isArray(searchParamsData?.status)
    ? searchParamsData?.status[0]
    : searchParamsData?.status;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Informasi Toko</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Perbarui detail kontak, jam operasional, dan metadata SEO utama. Hanya
          satu entri toko yang digunakan.
        </p>
        {status === "success" ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Informasi toko berhasil diperbarui.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Terjadi kesalahan saat menyimpan. Coba lagi.
          </p>
        ) : null}
      </header>
      <form action={updateSiteAction} className="space-y-8">
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
                defaultValue={site.hours ?? ""}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <div className="md:col-span-2">
              <ImageUrlInput
                name="logoLight"
                label="Logo (light)"
                defaultValue={site.logo.light}
                required
                helperText="Unggah logo versi background terang."
              />
            </div>
            <div className="md:col-span-2">
              <ImageUrlInput
                name="logoDark"
                label="Logo (dark)"
                defaultValue={site.logo.dark}
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
                defaultValue={site.social.instagram ?? ""}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              TikTok
              <input
                name="tiktok"
                defaultValue={site.social.tiktok ?? ""}
                className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Facebook
              <input
                name="facebook"
                defaultValue={site.social.facebook ?? ""}
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
                defaultValue={seo.keywords.join(", ")}
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
                defaultValue={seo.twitterHandle ?? ""}
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
