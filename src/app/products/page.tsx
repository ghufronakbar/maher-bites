import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ProductsListing } from "@/components/products-listing";
import { getAllCategories, getCategoryBySlug } from "@/data/categories";
import { getAllProducts } from "@/data/products";
import { getSite } from "@/data/site";

export const metadata: Metadata = {
  title: "Katalog Produk",
  description:
    "Jelajahi katalog Maher Bites: cookies chewy, snack box gurih, dan hampers cantik untuk hadiah maupun acara spesial.",
  alternates: {
    canonical: "/products",
    languages: {
      "id-ID": "/products",
    },
  },
};

export default async function ProductsPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const [products, categories, site] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getSite(),
  ]);

  const categoryParam = await searchParams?.category;
  const categorySlug = Array.isArray(categoryParam)
    ? categoryParam[0]
    : categoryParam;
  const initialCategory = categorySlug
    ? await getCategoryBySlug(categorySlug)
    : undefined;

  return (
    <div className="bg-white py-16">
      <Container>
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Katalog {site.name}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            Temukan camilan favorit Anda
          </h1>
          <p className="mt-3 text-base text-zinc-600">
            Pilih cookies, snack box, atau hampers untuk momen spesial. Semua
            dibuat dengan bahan premium dan bisa dikirim cepat.
          </p>
        </header>
        <div className="mt-10">
          <ProductsListing
            products={products}
            categories={categories}
            initialCategoryId={initialCategory?.id}
            whatsappUrl={site.whatsapp}
          />
        </div>
      </Container>
    </div>
  );
}
