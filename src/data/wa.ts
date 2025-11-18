// import { site } from './site';
import type { ProductRecord as Product } from './products';

interface WAParams {
  product: Product;
  whatsappUrl: string;
  qty?: number;
  variantOptionLabel?: string;
  note?: string;
}

export function createWAOrderLink({
  product,
  whatsappUrl,
  qty = 1,
  variantOptionLabel,
  note,
}: WAParams): string {
  const lines = [
    'Halo Maher Bites, saya ingin pesan:',
    `• Produk: ${product.name}`,
    variantOptionLabel ? `• Varian: ${variantOptionLabel}` : undefined,
    `• Qty: ${qty}`,
    note ? `• Catatan: ${note}` : undefined,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  return `${whatsappUrl}?text=${text}`;
}
