import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, revalidateTag, withCache } from '@/lib/cache';
import type { Testimonial } from '@prisma/client';

const fetchTestimonials = withCache(
  async () =>
    prisma.testimonial.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
  { key: ['testimonials', 'all'], tags: [CACHE_TAGS.testimonials], revalidate: false },
);

export async function getTestimonials(): Promise<Testimonial[]> {
  return await fetchTestimonials();
}

interface TestimonialInput {
  id?: number;
  name: string;
  handle?: string | null;
  message: string;
  rating: number;
  source?: Testimonial['source'];
  sortOrder?: number;
}

export async function upsertTestimonial({
  id,
  name,
  handle,
  message,
  rating,
  source,
  sortOrder = 0,
}: TestimonialInput) {
  await prisma.testimonial.upsert({
    where: { id: id ?? 0 },
    create: {
      name,
      handle: handle ?? null,
      message,
      rating,
      source: source ?? null,
      sortOrder,
    },
    update: {
      name,
      handle: handle ?? null,
      message,
      rating,
      source: source ?? null,
      sortOrder,
    },
  });

  revalidateTag(CACHE_TAGS.testimonials);
}

export async function deleteTestimonial(id: number) {
  await prisma.testimonial.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.testimonials);
}
