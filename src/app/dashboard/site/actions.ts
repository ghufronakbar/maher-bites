'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { upsertSite } from '@/data/site';

function toNullableString(value: FormDataEntryValue | null) {
  const text = value?.toString().trim() ?? '';
  return text.length ? text : null;
}

export async function updateSiteAction(formData: FormData) {
  try {
    const keywordsInput = toNullableString(formData.get('keywords')) ?? '';
    const keywords = keywordsInput
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    await upsertSite({
      name: formData.get('name')?.toString() ?? 'Maher Bites',
      domain: formData.get('domain')?.toString() ?? 'https://maherbites.id',
      locale: formData.get('locale')?.toString() ?? 'id-ID',
      whatsapp: formData.get('whatsapp')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      phone: formData.get('phone')?.toString() ?? '',
      address: formData.get('address')?.toString() ?? '',
      hours: toNullableString(formData.get('hours')),
      logoLight: formData.get('logoLight')?.toString() ?? '',
      logoDark: formData.get('logoDark')?.toString() ?? '',
      instagram: toNullableString(formData.get('instagram')),
      tiktok: toNullableString(formData.get('tiktok')),
      facebook: toNullableString(formData.get('facebook')),
      defaultTitle: formData.get('defaultTitle')?.toString() ?? '',
      defaultDescription: formData.get('defaultDescription')?.toString() ?? '',
      keywords,
      ogImage: formData.get('ogImage')?.toString() ?? '',
      twitterHandle: toNullableString(formData.get('twitterHandle')),
    });

    revalidatePath('/dashboard/site');
    redirect('/dashboard/site?status=success');
  } catch (error) {
    console.error('updateSiteAction error', error);
    redirect('/dashboard/site?status=error');
  }
}
