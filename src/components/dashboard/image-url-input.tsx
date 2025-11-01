'use client';

import Image from 'next/image';
import { useId, useRef, useState } from 'react';
import { uploadToCloudinary } from '@/components/dashboard/cloudinary-upload';

interface ImageUrlInputProps {
  name: string;
  label: string;
  defaultValue?: string;
  helperText?: string;
  required?: boolean;
}

export function ImageUrlInput({
  name,
  label,
  defaultValue,
  helperText,
  required,
}: ImageUrlInputProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue ?? '');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setStatus('uploading');
      setMessage('Mengunggah ke Cloudinary...');
      const result = await uploadToCloudinary(file);
      setValue(result.url);
      setStatus('success');
      setMessage('Upload berhasil. URL telah terisi.');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage((error as Error).message);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="flex flex-col text-sm font-medium text-zinc-700">
        <span>{label}</span>
        <div className="mt-1 flex items-center gap-3">
          <input
            id={inputId}
            name={name}
            required={required}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setStatus('idle');
              setMessage(null);
            }}
            placeholder="https://"
            className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            Upload
          </button>
        </div>
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />
      {helperText ? <p className="text-xs text-zinc-500">{helperText}</p> : null}
      {status === 'uploading' ? (
        <p className="text-xs font-medium text-emerald-600">{message}</p>
      ) : null}
      {status === 'error' ? <p className="text-xs font-medium text-red-600">{message}</p> : null}
      {status === 'success' ? <p className="text-xs font-medium text-emerald-600">{message}</p> : null}
      {value ? (
        <div className="relative h-32 overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-white">
          <Image src={value} alt={`${label} preview`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" unoptimized />
        </div>
      ) : null}
    </div>
  );
}
