import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { ProductDetail } from "@/components/product-detail";
import {
  // getAllProducts,
  getProductBySlug,
} from "@/data/products";
import { getSite } from "@/data/site";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// export async function generateStaticParams() {
//   const products = await getAllProducts();
//   return products.map((product) => ({ slug: product.slug }));
// }

export const revalidate = 60;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [site, product] = await Promise.all([
    getSite(),
    getProductBySlug(slug),
  ]);
  if (!product) return { title: "Produk Tidak Ditemukan" };

  const canonicalPath = `/products/${product.slug}`;
  const absoluteUrl = new URL(canonicalPath, site.domain).toString();

  return {
    title: product.name,
    description: product.shortDesc,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "id-ID": canonicalPath,
      },
    },
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      url: absoluteUrl,
      siteName: site.name,
      locale: site.locale,
      images: product.images.map((image) => ({
        url: new URL(image.src, site.domain).toString(),
        alt: image.alt,
      })),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDesc,
      images: product.images
        .slice(0, 1)
        .map((image) => new URL(image.src, site.domain).toString()),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [site, product] = await Promise.all([
    getSite(),
    getProductBySlug(slug),
  ]);
  if (!product) {
    notFound();
  }

  const canonicalUrl = new URL(
    `/products/${product.slug}`,
    site.domain
  ).toString();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) =>
      new URL(image.src, site.domain).toString()
    ),
    description: product.longDesc,
    brand: {
      "@type": "Brand",
      name: site.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: site.domain,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Produk",
        item: `${site.domain}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <div className="bg-white py-12 lg:py-16">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Produk", href: "/products" },
              { label: product.name, href: `/products/${product.slug}` },
            ]}
            className="mb-6"
          />
          <ProductDetail product={product} whatsappUrl={site.whatsapp} />
          <div className="mt-12 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 text-sm text-emerald-800 lg:mt-14">
            <h2 className="text-lg font-semibold text-emerald-900">
              Kenapa pesan langsung via WhatsApp?
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>Konsultasi varian &amp; jumlah terbaik sesuai budget.</li>
              <li>Konfirmasi jadwal kirim &amp; alamat secara real-time.</li>
              <li>Custom kartu ucapan atau packaging tanpa biaya tambahan.</li>
            </ul>
          </div>
        </Container>
      </div>
      <Script
        id="ld-json-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Script
        id="ld-json-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
