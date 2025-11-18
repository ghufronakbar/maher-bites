import type { Prisma } from '@prisma/client';

export type ProductImage = {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  sortOrder: number;
};

export type ProductVariant = {
  name: string;
  options: {
    label: string;
    price: number;
    value?: string | null;
  }[];
};

export const isVariantArray = (
  variants: Prisma.JsonValue,
): variants is ProductVariant[] => {
  if (!Array.isArray(variants)) return false;
  return variants.every((variant) => {
    if (typeof variant !== 'object' || variant === null) return false;
    const name = 'name' in variant && typeof variant.name === 'string';
    const options =
      'options' in variant &&
      Array.isArray(variant.options) &&
      variant.options.every((option: unknown) => {
        if (typeof option !== 'object' || option === null) return false;
        const label = 'label' in option && typeof option.label === 'string';
        const price = 'price' in option && typeof option.price === 'number';
        return label && price;
      });
    return name && options;
  });
};

export const isImageArray = (
  images: Prisma.JsonValue,
): images is ProductImage[] => {
  if (!Array.isArray(images)) return false;
  return images.every((image) => {
    if (typeof image !== 'object' || image === null) return false;
    const src = 'src' in image && typeof image.src === 'string';
    const alt = 'alt' in image && typeof image.alt === 'string';
    return src && alt;
  });
};
