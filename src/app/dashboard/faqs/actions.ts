'use server';

import { revalidatePath } from 'next/cache';
import { deleteFAQ, upsertFAQ } from '@/data/faqs';
import { z } from 'zod';

const UpsertFAQSchema = z.object({
  id: z.number().optional(),
  question: z.string(),
  answer: z.string(),
  sortOrder: z.number(),
});

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function upsertFAQAction(formData: FormData): Promise<ActionResponse> {
  const id = formData.get('id')?.toString();
  const data = {
    id: id ? Number(id) : undefined,
    question: formData.get('question')?.toString().trim(),
    answer: formData.get('answer')?.toString().trim(),
    sortOrder: Number(formData.get('sortOrder') ?? 0),
  };

  const parsed = UpsertFAQSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Gagal menyimpan FAQ, data tidak valid',
    };
  }

  try {
    await upsertFAQ(parsed.data);
    revalidatePath('/dashboard/faqs');
    return {
      success: true,
      message: 'FAQ berhasil disimpan',
    };
  } catch (error) {
    console.error('upsertFAQAction error', error);
    return {
      success: false,
      message: 'Gagal menyimpan FAQ',
    };
  }
}

export async function deleteFAQAction(formData: FormData): Promise<ActionResponse> {
  const id = formData.get('id');
  if (!id) {
    return {
      success: false,
      message: 'Gagal menghapus FAQ, ID tidak ditemukan',
    };
  }

  try {
    await deleteFAQ(Number(id));
    revalidatePath('/dashboard/faqs');
    return {
      success: true,
      message: 'FAQ berhasil dihapus',
    };
  } catch (error) {
    console.error('deleteFAQAction error', error);
    return {
      success: false,
      message: 'Gagal menghapus FAQ',
    };
  }
}
