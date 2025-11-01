import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/data/products';
import { getSite } from '@/data/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const site = await getSite();
  const baseUrl = site.domain;
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now },
    { url: `${baseUrl}/products`, lastModified: now },
    { url: `${baseUrl}/about`, lastModified: now },
    { url: `${baseUrl}/contact`, lastModified: now },
  ];

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: now,
  }));

  return [...routes, ...productRoutes];
}
