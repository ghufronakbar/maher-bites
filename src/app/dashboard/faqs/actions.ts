'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteFAQ, upsertFAQ } from '@/data/faqs';

export async function upsertFAQAction(formData: FormData) {
  const id = formData.get('id')?.toString();
  const question = formData.get('question')?.toString().trim();
  const answer = formData.get('answer')?.toString().trim();
  const sortOrder = Number(formData.get('sortOrder') ?? 0);

  if (!question || !answer) {
    redirect('/dashboard/faqs?status=error');
  }

  try {
    await upsertFAQ({
      id: id ? Number(id) : undefined,
      question,
      answer,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    });
    revalidatePath('/dashboard/faqs');
    redirect('/dashboard/faqs?status=success');
  } catch (error) {
    console.error('upsertFAQAction error', error);
    redirect('/dashboard/faqs?status=error');
  }
}

export async function deleteFAQAction(formData: FormData) {
  const id = formData.get('id');
  if (!id) {
    redirect('/dashboard/faqs?status=error');
  }

  try {
    await deleteFAQ(Number(id));
    revalidatePath('/dashboard/faqs');
    redirect('/dashboard/faqs?status=deleted');
  } catch (error) {
    console.error('deleteFAQAction error', error);
    redirect('/dashboard/faqs?status=error');
  }
}
