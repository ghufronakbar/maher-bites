"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Site } from "@prisma/client";
import { nav } from "@/data/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SiteHeaderProps {
  site: Site;
}

export function SiteHeader({ site }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={site.logoLight}
                alt={site.name}
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="flex flex-col text-sm font-medium leading-tight text-zinc-900">
                {site.name}
                <span className="text-xs font-normal text-zinc-500">
                  {site.defaultTitle}
                </span>
              </span>
            </Link>
          </div>
          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-6 md:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-semibold text-zinc-600 transition hover:text-zinc-900",
                  pathname === item.href && "text-zinc-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <a
              href={`${site.whatsapp}?text=${encodeURIComponent(
                "Halo Maher Snack & Cookies, saya ingin pesan camilan."
              )}`}
              className="inline-flex items-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              Pesan via WhatsApp
            </a>
          </div>
        </div>
        <nav
          aria-label="Navigasi utama"
          className="flex items-center gap-4 overflow-x-auto pb-3 md:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-emerald-500 hover:text-emerald-600",
                pathname === item.href && "border-emerald-500 text-emerald-600"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
