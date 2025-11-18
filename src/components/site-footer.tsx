import Link from 'next/link';
import type { Site } from '@prisma/client';
import { nav } from '@/data/navigation';
import { Container } from '@/components/container';

interface SiteFooterProps {
  site: Site;
}

export function SiteFooter({ site }: SiteFooterProps) {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">{site.name}</h3>
            <p className="mt-3 text-sm text-zinc-600">{site.address}</p>
            {site.hours ? (
              <p className="mt-2 text-sm text-zinc-600">{site.hours}</p>
            ) : null}
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Navigasi
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-emerald-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Hubungi Kami
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                <a href={`tel:${site.phone}`} className="transition hover:text-emerald-600">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="transition hover:text-emerald-600">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.whatsapp} className="transition hover:text-emerald-600">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Sosial Media
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              {site.instagram && (
                <li>
                  <a
                    href={site.instagram}
                    className="transition hover:text-emerald-600"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {site.tiktok && (
                <li>
                  <a
                    href={site.tiktok}
                    className="transition hover:text-emerald-600"
                    rel="noopener noreferrer"
                  >
                    TikTok
                  </a>
                </li>
              )}
              {site.facebook && (
                <li>
                  <a
                    href={site.facebook}
                    className="transition hover:text-emerald-600"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} {site.name}. Semua hak cipta.
        </div>
      </Container>
    </footer>
  );
}
