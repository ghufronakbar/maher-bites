'use client';

import Image from 'next/image';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { uploadToCloudinary } from '@/components/dashboard/cloudinary-upload';
import type { ProductImage } from './types';

interface ImageField {
  id: string;
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
}

interface ImageFieldsProps {
  name: string;
  initialImages: ProductImage[];
}

function createEmptyImage(): ImageField {
  return {
    id: crypto.randomUUID(),
    src: '',
    alt: '',
    width: null,
    height: null,
  };
}

export function ImageFields({ name, initialImages }: ImageFieldsProps) {
  const hiddenInputId = useId();
  const [images, setImages] = useState<ImageField[]>(
    initialImages.length
      ? initialImages.map((image) => ({
          id: crypto.randomUUID(),
          src: image.src,
          alt: image.alt,
          width: image.width ?? null,
          height: image.height ?? null,
        }))
      : [createEmptyImage()],
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');

  const serializedValue = useMemo(() => {
    return JSON.stringify(
      images.map((image, index) => ({
        src: image.src,
        alt: image.alt,
        width: image.width ?? undefined,
        height: image.height ?? undefined,
        sortOrder: index,
      })),
    );
  }, [images]);

  useEffect(() => {
    if (images.some((image) => !image.src)) {
      setStatusType('info');
      setStatusMessage('Lengkapi URL gambar atau upload file untuk setiap card.');
    } else {
      setStatusMessage(null);
    }
  }, [images]);

  const handleUpdate = (id: string, patch: Partial<ImageField>) => {
    setImages((prev) =>
      prev.map((image) => (image.id === id ? { ...image, ...patch } : image)),
    );
  };

  const handleRemove = (id: string) => {
    setImages((prev) => (prev.length > 1 ? prev.filter((image) => image.id !== id) : prev));
  };

  const handleAdd = () => {
    setImages((prev) => [...prev, createEmptyImage()]);
  };

  const handleUpload = async (id: string, file: File) => {
    try {
      setStatusType('info');
      setStatusMessage('Mengunggah gambar...');
      const result = await uploadToCloudinary(file);
      handleUpdate(id, {
        src: result.url,
        width: result.width ?? null,
        height: result.height ?? null,
      });
      setStatusType('success');
      setStatusMessage('Gambar berhasil diunggah.');
    } catch (error) {
      console.error(error);
      setStatusType('error');
      setStatusMessage((error as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <input id={hiddenInputId} type="hidden" name={name} value={serializedValue} />
      <div className="grid gap-4 md:grid-cols-2">
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            order={index + 1}
            image={image}
            onChange={(patch) => handleUpdate(image.id, patch)}
            onRemove={() => handleRemove(image.id)}
            onUpload={(file) => handleUpload(image.id, file)}
            disableRemove={images.length === 1}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-full border border-dashed border-emerald-300 px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:border-emerald-500 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          + Tambah Gambar
        </button>
        {statusMessage ? (
          <p
            className={`text-xs font-medium ${
              statusType === 'error'
                ? 'text-red-600'
                : statusType === 'success'
                  ? 'text-emerald-600'
                  : 'text-zinc-500'
            }`}
          >
            {statusMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}

interface ImageCardProps {
  order: number;
  image: ImageField;
  disableRemove: boolean;
  onRemove: () => void;
  onChange: (patch: Partial<ImageField>) => void;
  onUpload: (file: File) => Promise<void>;
}

function ImageCard({ order, image, disableRemove, onRemove, onChange, onUpload }: ImageCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      setUploadError((error as Error).message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Gambar #{order}
        </span>
        <button
          type="button"
          onClick={onRemove}
          disabled={disableRemove}
          className="text-xs font-semibold uppercase tracking-wide text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:text-zinc-300"
        >
          Hapus
        </button>
      </div>
      <div className="mt-3 space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <input
            value={image.src}
            onChange={(event) => onChange({ src: event.target.value.trim() })}
            placeholder="https://"
            className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            {isUploading ? 'Mengunggah...' : 'Upload'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileSelection}
          />
        </div>
        <input
          value={image.alt}
          onChange={(event) => onChange({ alt: event.target.value })}
          placeholder="Alt text (a11y)"
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Width
            <input
              type="number"
              value={image.width ?? ''}
              onChange={(event) =>
                onChange({ width: event.target.value ? Number(event.target.value) : null })
              }
              placeholder="auto"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Height
            <input
              type="number"
              value={image.height ?? ''}
              onChange={(event) =>
                onChange({ height: event.target.value ? Number(event.target.value) : null })
              }
              placeholder="auto"
              className="mt-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </div>
        {uploadError ? (
          <p className="text-xs font-medium text-red-600">{uploadError}</p>
        ) : null}
        {image.src ? (
          <div className="relative h-40 overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-white">
            <Image
              src={image.src}
              alt={image.alt || `Preview gambar ${order}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
