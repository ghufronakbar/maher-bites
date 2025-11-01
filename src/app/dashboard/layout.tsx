import Link from "next/link";
import type { ReactNode } from "react";
import { nav as publicNav } from "@/data/navigation";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/constants";
import { verifyAuthToken } from "@/lib/auth";

const dashboardNav = [
  { href: "/dashboard", label: "Ringkasan" },
  { href: "/dashboard/site", label: "Informasi Toko" },
  { href: "/dashboard/categories", label: "Kategori" },
  { href: "/dashboard/products", label: "Produk" },
  { href: "/dashboard/faqs", label: "FAQ" },
  { href: "/dashboard/testimonials", label: "Testimonial" },
] as const;

const verfifyOrRedirectToLogin = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await verifyAuthToken(token) : null;
  if (!payload) {
    const loginUrl = "/login";
    return redirect(loginUrl);
  }
  return payload;
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await verfifyOrRedirectToLogin();
  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:w-64">
          <h1 className="text-lg font-semibold text-zinc-900">Dashboard</h1>
          <p className="mt-1 text-xs text-zinc-500">
            Kelola konten Maher Bites dengan cepat.
          </p>
          <nav className="mt-6 space-y-1">
            {dashboardNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-emerald-50 hover:text-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 border-t border-dashed border-zinc-200 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Menu Publik
            </p>
            <ul className="mt-3 space-y-1 text-xs text-zinc-500">
              {publicNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <main className="flex-1 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
