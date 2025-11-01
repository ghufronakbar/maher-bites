export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(value: number, currency: 'IDR' = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildCanonical(pathname: string, siteUrl: string) {
  const normalized = pathname === '/' ? '' : pathname.replace(/\/+$/, '');
  return `${siteUrl}${normalized || '/'}`;
}
