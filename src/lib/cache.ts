import { unstable_cache, revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  site: "site",
  categories: "categories",
  products: "products",
  faqs: "faqs",
  testimonials: "testimonials",
} as const;

type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export { revalidateTag };

interface CacheOptions {
  key: string[];
  tags: CacheTag[];
  revalidate?: number | false;
}

export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  { key, tags, revalidate }: CacheOptions
): (...args: TArgs) => Promise<TResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return unstable_cache(fn as (...args: any[]) => Promise<any>, key, {
    tags,
    revalidate,
  }) as (...args: TArgs) => Promise<TResult>;
}
