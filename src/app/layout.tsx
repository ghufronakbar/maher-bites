import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AnalyticsTracker } from '@/components/analytics-tracker';
import { SiteShell } from '@/components/site-shell';
import { getSEOConfig, getSite } from '@/data/site';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const [seo, site] = await Promise.all([getSEOConfig(), getSite()]);
  return {
    metadataBase: new URL(seo.siteUrl),
    title: {
      default: seo.defaultTitle,
      template: `%s | ${site.name}`,
    },
    description: seo.defaultDescription,
    keywords: seo.keywords,
    alternates: {
      canonical: '/',
      languages: {
        'id-ID': '/',
      },
    },
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      url: seo.siteUrl,
      siteName: site.name,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${site.name} OG Image`,
        },
      ],
      locale: site.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: seo.twitterHandle,
      creator: seo.twitterHandle,
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: [seo.ogImage],
    },
    icons: {
      icon: site.logoLight ?? '/favicon.ico',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-zinc-900 antialiased`}
      >
        <AnalyticsTracker />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
