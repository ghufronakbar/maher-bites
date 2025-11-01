import type { Category } from './schema';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS, revalidateTag, withCache } from '@/lib/cache';

const fetchCategories = withCache(
  async () =>
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  { key: ['categories', 'all'], tags: [CACHE_TAGS.categories], revalidate: false },
);

export async function getAllCategories(): Promise<Category[]> {
  const categories = await fetchCategories();
  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? undefined,
  }));
}

export async function getCategoryById(id: string) {
  const categories = await fetchCategories();
  const category = categories.find((item) => item.id === id);
  if (!category) return undefined;
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? undefined,
  };
}

export async function getCategoryBySlug(slug: string) {
  const categories = await fetchCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return undefined;
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? undefined,
  };
}

interface CategoryInput {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

export async function upsertCategory(data: CategoryInput) {
  const category = await prisma.category.upsert({
    where: { id: data.id },
    create: {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description ?? null,
    },
    update: {
      slug: data.slug,
      name: data.name,
      description: data.description ?? null,
    },
  });

  revalidateTag(CACHE_TAGS.categories);
  return category;
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.categories);
}
