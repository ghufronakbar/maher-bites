import type { ReactNode } from 'react';
import Script from 'next/script';
import { getSite } from '@/data/site';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { StickyWAButton } from '@/components/sticky-wa-button';

interface SiteShellProps {
  children: ReactNode;
}

export async function SiteShell({ children }: SiteShellProps) {
  const site = await getSite();

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.domain,
    logo: new URL(site.logo.light, site.domain).toString(),
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressCountry: 'ID',
    },
    sameAs: Object.values(site.social).filter(Boolean),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: site.phone,
        email: site.email,
        areaServed: 'ID',
        availableLanguage: ['id', 'en'],
      },
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.domain,
    inLanguage: site.locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site.domain}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <SiteHeader site={site} />
      <main id="main-content" className="relative">
        {children}
      </main>
      <SiteFooter site={site} />
      <StickyWAButton whatsappUrl={site.whatsapp} />
      <Script
        id="ld-json-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="ld-json-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </>
  );
}
