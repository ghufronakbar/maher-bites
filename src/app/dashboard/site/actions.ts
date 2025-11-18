'use server';

import { revalidatePath } from 'next/cache';
import { upsertSite } from '@/data/site';
import { z } from 'zod';

const UpdateSiteSchema = z.object({
  name: z.string(),
  domain: z.string(),
  locale: z.string(),
  whatsapp: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  hours: z.string().nullable(),
  logoLight: z.string(),
  logoDark: z.string(),
  instagram: z.string().nullable(),
  tiktok: z.string().nullable(),
  facebook: z.string().nullable(),
  defaultTitle: z.string(),
  defaultDescription: z.string(),
  keywords: z.array(z.string()),
  ogImage: z.string(),
  twitterHandle: z.string().nullable(),
});

type ActionResponse = {
  success: boolean;
  message: string;
};

function toNullableString(value: FormDataEntryValue | null) {
  const text = value?.toString().trim() ?? '';
  return text.length ? text : null;
}

export async function updateSiteAction(
  formData: FormData,
): Promise<ActionResponse> {
  const keywordsInput = toNullableString(formData.get('keywords')) ?? '';
  const data = {
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
    defaultDescription:
      formData.get('defaultDescription')?.toString() ?? '',
    keywords: keywordsInput
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    ogImage: formData.get('ogImage')?.toString() ?? '',
    twitterHandle: toNullableString(formData.get('twitterHandle')),
  };

  const parsed = UpdateSiteSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Gagal menyimpan informasi, data tidak valid',
    };
  }

  try {
    await upsertSite(parsed.data);
    revalidatePath('/dashboard/site');
    return {
      success: true,
      message: 'Informasi berhasil disimpan',
    };
  } catch (error) {
    console.error('updateSiteAction error', error);
    return {
      success: false,
      message: 'Gagal menyimpan informasi',
    };
  }
}
