'use server';

import crypto from 'node:crypto';
import { assertCloudinaryConfig, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '@/constants/cloudinary';

export interface UploadResult {
  url: string;
  width?: number;
  height?: number;
}

export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  assertCloudinaryConfig();

  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new Error('File tidak ditemukan pada FormData.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signaturePayload = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex');

  const uploadForm = new FormData();
  uploadForm.append('file', file, file.name);
  uploadForm.append('timestamp', timestamp.toString());
  uploadForm.append('api_key', CLOUDINARY_API_KEY);
  uploadForm.append('signature', signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: uploadForm,
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorPayload}`);
  }

  const payload = (await response.json()) as {
    secure_url?: string;
    url?: string;
    width?: number;
    height?: number;
  };

  return {
    url: payload.secure_url ?? payload.url ?? '',
    width: payload.width,
    height: payload.height,
  };
}
