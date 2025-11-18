import type { SEOConfig } from "./schema";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, revalidateTag, withCache } from "@/lib/cache";
import { Site } from "@prisma/client";

const fetchSiteRecord = withCache<[], Site>(
  async () => {
    const site = await prisma.site.findUnique({ where: { id: 1 } });
    if (!site) {
      return {
        id: 1,
        name: "Maher Snack & Cookies",
        domain: "https://maherbites.id",
        locale: "id-ID",
        whatsapp: "https://wa.me/6281234567890",
        email: "hello@maherbites.id",
        phone: "+62 812-3456-7890",
        address: "Jl. Contoh No. 12, Jakarta Selatan",
        createdAt: new Date(),
        updatedAt: new Date(),
        logoLight: "/images/brand/logo-light.svg",
        logoDark: "/images/brand/logo-dark.svg",
        instagram: "https://instagram.com/maherbites",
        tiktok: "https://tiktok.com/@maherbites",
        facebook: "https://facebook.com/maherbites",
        defaultTitle: "Maher Snack & Cookies",
        defaultDescription: "Maher Snack & Cookies",
        hours: "Senin–Sabtu 09.00–18.00 WIB",
        keywords: [
          "maher snack & cookies",
          "cookies",
          "kue kering",
          "snack box",
          "hampers",
          "kue kering premium",
        ],
        ogImage: "https://maherbites.id/og/default.png",
        twitterHandle: "@maherbites",
      };
    }

    return site;
  },
  { key: ["site", "record"], tags: [CACHE_TAGS.site], revalidate: false }
);

export async function getSite(): Promise<Site> {
  return await fetchSiteRecord();
}

export async function getSEOConfig(): Promise<SEOConfig> {
  const site = await fetchSiteRecord();
  return {
    defaultTitle: site.defaultTitle,
    defaultDescription: site.defaultDescription,
    keywords: (site.keywords as string[]) ?? [],
    ogImage: site.ogImage,
    twitterHandle: site.twitterHandle ?? undefined,
    siteUrl: site.domain,
  };
}

interface SiteUpdateInput {
  name: string;
  domain: string;
  locale?: string;
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  hours?: string | null;
  logoLight: string;
  logoDark: string;
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  defaultTitle: string;
  defaultDescription: string;
  keywords?: string[];
  ogImage: string;
  twitterHandle?: string | null;
}

export async function upsertSite(data: SiteUpdateInput) {
  const payload = {
    ...data,
    locale: data.locale ?? "id-ID",
    hours: data.hours ?? null,
    instagram: data.instagram ?? null,
    tiktok: data.tiktok ?? null,
    facebook: data.facebook ?? null,
    twitterHandle: data.twitterHandle ?? null,
    keywords: data.keywords ?? [],
  };

  const site = await prisma.site.upsert({
    where: { id: 1 },
    create: payload,
    update: payload,
  });

  revalidateTag(CACHE_TAGS.site);
  return site;
}
