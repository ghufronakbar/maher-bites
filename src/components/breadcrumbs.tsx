import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm text-zinc-500', className)}>
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="transition hover:text-emerald-600">
            Beranda
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1">
            <span aria-hidden="true">›</span>
            {index === items.length - 1 ? (
              <span className="text-zinc-700">{item.label}</span>
            ) : (
              <Link href={item.href} className="transition hover:text-emerald-600">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
