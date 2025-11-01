'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteTestimonial, upsertTestimonial } from '@/data/testimonials';

export async function upsertTestimonialAction(formData: FormData) {
  const id = formData.get('id')?.toString();
  const name = formData.get('name')?.toString().trim();
  const message = formData.get('message')?.toString().trim();
  const rating = Number(formData.get('rating') ?? 0);

  if (!name || !message || !Number.isFinite(rating)) {
    redirect('/dashboard/testimonials?status=error');
  }

  try {
    await upsertTestimonial({
      id: id ? Number(id) : undefined,
      name,
      handle: formData.get('handle')?.toString() ?? null,
      message,
      rating,
      source: formData.get('source')?.toString() as
        | 'instagram'
        | 'tiktok'
        | 'whatsapp'
        | 'google'
        | undefined,
      sortOrder: Number(formData.get('sortOrder') ?? 0) || 0,
    });
    revalidatePath('/dashboard/testimonials');
    redirect('/dashboard/testimonials?status=success');
  } catch (error) {
    console.error('upsertTestimonialAction error', error);
    redirect('/dashboard/testimonials?status=error');
  }
}

export async function deleteTestimonialAction(formData: FormData) {
  const id = formData.get('id');
  if (!id) {
    redirect('/dashboard/testimonials?status=error');
  }

  try {
    await deleteTestimonial(Number(id));
    revalidatePath('/dashboard/testimonials');
    redirect('/dashboard/testimonials?status=deleted');
  } catch (error) {
    console.error('deleteTestimonialAction error', error);
    redirect('/dashboard/testimonials?status=error');
  }
}
