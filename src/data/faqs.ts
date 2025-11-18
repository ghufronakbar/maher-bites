import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, revalidateTag, withCache } from '@/lib/cache';
import type { FAQ } from '@prisma/client';

const fetchFaqs = withCache(
  async () =>
    prisma.fAQ.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
  { key: ['faqs', 'all'], tags: [CACHE_TAGS.faqs], revalidate: false },
);

export async function getFAQs(): Promise<FAQ[]> {
  return await fetchFaqs();
}

interface FAQInput {
  id?: number;
  question: string;
  answer: string;
  sortOrder?: number;
}

export async function upsertFAQ({ id, question, answer, sortOrder = 0 }: FAQInput) {
  await prisma.fAQ.upsert({
    where: { id: id ?? 0 },
    create: { question, answer, sortOrder },
    update: { question, answer, sortOrder },
  });

  revalidateTag(CACHE_TAGS.faqs);
}

export async function deleteFAQ(id: number) {
  await prisma.fAQ.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.faqs);
}
