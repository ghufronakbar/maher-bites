'use client';

import type { UploadResult } from '@/app/dashboard/upload-image-action';
import { uploadImageAction } from '@/app/dashboard/upload-image-action';

export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  const payload = new FormData();
  payload.append('file', file, file.name);
  return uploadImageAction(payload);
}
