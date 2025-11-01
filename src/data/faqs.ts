import type { FAQ } from './schema';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, revalidateTag, withCache } from '@/lib/cache';

const fetchFaqs = withCache(
  async () =>
    prisma.fAQ.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
  { key: ['faqs', 'all'], tags: [CACHE_TAGS.faqs], revalidate: false },
);

export async function getFAQs(): Promise<FAQ[]> {
  const faqs = await fetchFaqs();
  return faqs.map((faq) => ({
    id: faq.id,
    q: faq.question,
    a: faq.answer,
    sortOrder: faq.sortOrder ?? undefined,
  }));
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
