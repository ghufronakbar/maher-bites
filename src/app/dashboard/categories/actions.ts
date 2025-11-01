'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteCategory, upsertCategory } from '@/data/categories';

export async function upsertCategoryAction(formData: FormData) {
  const id = formData.get('id')?.toString().trim();
  const slug = formData.get('slug')?.toString().trim();
  const name = formData.get('name')?.toString().trim();

  if (!id || !slug || !name) {
    redirect('/dashboard/categories?status=error');
  }

  try {
    await upsertCategory({
      id,
      slug,
      name,
      description: formData.get('description')?.toString() ?? null,
    });
    revalidatePath('/dashboard/categories');
    redirect('/dashboard/categories?status=success');
  } catch (error) {
    console.error('upsertCategoryAction error', error);
    redirect('/dashboard/categories?status=error');
  }
}

export async function deleteCategoryAction(formData: FormData) {
  const id = formData.get('id')?.toString();
  if (!id) {
    redirect('/dashboard/categories?status=error');
  }

  try {
    await deleteCategory(id);
    revalidatePath('/dashboard/categories');
    redirect('/dashboard/categories?status=deleted');
  } catch (error) {
    console.error('deleteCategoryAction error', error);
    redirect('/dashboard/categories?status=error');
  }
}
