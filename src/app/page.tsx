import Script from "next/script";
import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { FAQSection } from "@/components/faq-section";
import { ProductCard } from "@/components/product-card";
import { TestimonialsSection } from "@/components/testimonials-section";
import { USPGrid } from "@/components/usp-grid";
import { Container } from "@/components/container";
import { getAllCategories } from "@/data/categories";
import { getBestSellers } from "@/data/products";
import { getFAQs } from "@/data/faqs";
import { getSite } from "@/data/site";
import { getTestimonials } from "@/data/testimonials";

export default async function HomePage() {
  const [site, bestSellers, categories, faqs, testimonials] = await Promise.all(
    [
      getSite(),
      getBestSellers(4),
      getAllCategories(),
      getFAQs(),
      getTestimonials(),
    ]
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const consultationUrl = `${site.whatsapp}?text=${encodeURIComponent(
    "Halo Maher Snack & Cookies, saya ingin konsultasi untuk hampers/snack box."
  )}`;

  return (
    <>
      <HeroSection site={site} />
      <USPGrid />
      <section
        aria-labelledby="best-sellers-heading"
        className="bg-white py-16"
      >
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2
                id="best-sellers-heading"
                className="text-2xl font-semibold text-zinc-900"
              >
                Favorit Maher Snack & Cookies
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Rekomendasi pelanggan paling sering repeat order.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              Lihat semua produk →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                displayCategoryLink
                whatsappUrl={site.whatsapp}
              />
            ))}
          </div>
        </Container>
      </section>
      <section
        aria-labelledby="category-heading"
        className="bg-amber-50/80 py-16"
      >
        <Container>
          <h2
            id="category-heading"
            className="text-2xl font-semibold text-zinc-900"
          >
            Pilih Sesuai Kebutuhan
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-zinc-900">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">
                  {category.description}
                </p>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                >
                  Lihat kategori →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <section className="bg-white py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Lokasi Kami
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              Kunjungi dapur kami untuk mengambil pesanan atau sekadar menyapa.
            </p>
          </div>
          <div className="mt-10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d515.2313010353087!2d110.21011214117657!3d-7.559545212049383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8c2034ffb5b1%3A0x624a53e98aa52e8a!2stoko%20kue%20maher!5e0!3m2!1sid!2sid!4v1763487289630!5m2!1sid!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-3xl shadow-lg"
            ></iframe>
          </div>
        </Container>
      </section>
      <section className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 py-16 text-white">
        <Container className="flex flex-col items-start gap-6 rounded-3xl bg-white/10 p-10 shadow-lg backdrop-blur">
          <h2 className="text-3xl font-semibold">
            Siap kirim hampers atau snack box besok?
          </h2>
          <p className="max-w-2xl text-base text-emerald-50">
            Konsultasikan kebutuhan Anda. Tim kami bantu rekomendasi varian,
            jumlah, dan desain kartu ucapan tanpa biaya tambahan.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href={consultationUrl}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-emerald-600 shadow-sm transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi WhatsApp
            </a>
            <Link
              href="/products?category=cookies"
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Cek Cookies Premium
            </Link>
          </div>
        </Container>
      </section>
      <Script
        id="ld-json-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
