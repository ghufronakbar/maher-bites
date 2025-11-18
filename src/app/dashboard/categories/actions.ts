'use server';

import { revalidatePath } from 'next/cache';
import { deleteCategory, upsertCategory } from '@/data/categories';
import { z } from 'zod';

const UpsertCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function upsertCategoryAction(
  formData: FormData,
): Promise<ActionResponse> {
  const data = {
    id: formData.get('id')?.toString().trim(),
    slug: formData.get('slug')?.toString().trim(),
    name: formData.get('name')?.toString().trim(),
    description: formData.get('description')?.toString() ?? undefined,
  };

  const parsed = UpsertCategorySchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Gagal menyimpan kategori, data tidak valid',
    };
  }

  try {
    await upsertCategory(parsed.data);
    revalidatePath('/dashboard/categories');
    return {
      success: true,
      message: 'Kategori berhasil disimpan',
    };
  } catch (error) {
    console.error('upsertCategoryAction error', error);
    return {
      success: false,
      message: 'Gagal menyimpan kategori',
    };
  }
}

export async function deleteCategoryAction(
  formData: FormData,
): Promise<ActionResponse> {
  const id = formData.get('id')?.toString();
  if (!id) {
    return {
      success: false,
      message: 'Gagal menghapus kategori, ID tidak ditemukan',
    };
  }

  try {
    await deleteCategory(id);
    revalidatePath('/dashboard/categories');
    return {
      success: true,
      message: 'Kategori berhasil dihapus',
    };
  } catch (error) {
    console.error('deleteCategoryAction error', error);
    return {
      success: false,
      message: 'Gagal menghapus kategori',
    };
  }
}
