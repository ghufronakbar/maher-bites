'use client';

import { trackWAEvent } from '@/lib/analytics';

interface StickyWAButtonProps {
  whatsappUrl: string;
}

export function StickyWAButton({ whatsappUrl }: StickyWAButtonProps) {
  const href = `${whatsappUrl}?text=${encodeURIComponent(
    'Halo Maher Bites, saya mau tanya dan pesan camilan.',
  )}`;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden" role="presentation">
      <a
        href={href}
        onClick={() => trackWAEvent({ source: 'sticky_cta', product: 'general' })}
        className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-emerald-500/30 transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        <span aria-hidden="true">💬</span>
        <span>Pesan via WhatsApp</span>
      </a>
    </div>
  );
}
