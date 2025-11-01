'use client';

import { useMemo, useState } from 'react';

interface VariantOptionState {
  id: string;
  label: string;
  value?: string;
  price: number;
}

interface VariantState {
  id: string;
  name: string;
  options: VariantOptionState[];
}

interface VariantFieldsProps {
  name: string;
  initialVariants:
    | Array<{
        name: string;
        options: Array<{
          label: string;
          value?: string | null;
          price: number;
        }>;
      }>
    | undefined;
}

const createOption = (): VariantOptionState => ({
  id: crypto.randomUUID(),
  label: '',
  value: '',
  price: 0,
});

const createVariant = (): VariantState => ({
  id: crypto.randomUUID(),
  name: '',
  options: [createOption()],
});

export function VariantFields({ name, initialVariants }: VariantFieldsProps) {
  const [variants, setVariants] = useState<VariantState[]>(
    initialVariants?.length
      ? initialVariants.map((variant) => ({
          id: crypto.randomUUID(),
          name: variant.name,
          options: variant.options.map((option) => ({
            id: crypto.randomUUID(),
            label: option.label,
            value: option.value ?? '',
            price: option.price,
          })),
        }))
      : [createVariant()],
  );

  const serializedValue = useMemo(() => {
    return JSON.stringify(
      variants.map((variant) => ({
        name: variant.name,
        options: variant.options.map((option) => ({
          label: option.label,
          value: option.value?.trim() || undefined,
          price: option.price,
        })),
      })),
    );
  }, [variants]);

  const updateVariant = (id: string, patch: Partial<VariantState>) => {
    setVariants((prev) =>
      prev.map((variant) => (variant.id === id ? { ...variant, ...patch } : variant)),
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, createVariant()]);
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => (prev.length > 1 ? prev.filter((variant) => variant.id !== id) : prev));
  };

  const addOption = (variantId: string) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              options: [...variant.options, createOption()],
            }
          : variant,
      ),
    );
  };

  const updateOption = (variantId: string, optionId: string, patch: Partial<VariantOptionState>) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              options: variant.options.map((option) =>
                option.id === optionId ? { ...option, ...patch } : option,
              ),
            }
          : variant,
      ),
    );
  };

  const removeOption = (variantId: string, optionId: string) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              options:
                variant.options.length > 1
                  ? variant.options.filter((option) => option.id !== optionId)
                  : variant.options,
            }
          : variant,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serializedValue} />
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div key={variant.id} className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Varian #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeVariant(variant.id)}
                disabled={variants.length === 1}
                className="text-xs font-semibold uppercase tracking-wide text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:text-zinc-300"
              >
                Hapus
              </button>
            </div>
            <input
              value={variant.name}
              onChange={(event) => updateVariant(variant.id, { name: event.target.value })}
              placeholder="Nama varian (mis. Ukuran)"
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <div className="space-y-3">
              {variant.options.map((option) => (
                <div
                  key={option.id}
                  className="grid gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-4 md:grid-cols-[1.2fr,1fr,120px,auto]"
                >
                  <input
                    value={option.label}
                    onChange={(event) =>
                      updateOption(variant.id, option.id, { label: event.target.value })
                    }
                    placeholder="Label opsi (mis. S 180g)"
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <input
                    value={option.value}
                    onChange={(event) =>
                      updateOption(variant.id, option.id, { value: event.target.value })
                    }
                    placeholder="Value (opsional)"
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <input
                    type="number"
                    value={option.price}
                    onChange={(event) =>
                      updateOption(variant.id, option.id, { price: Number(event.target.value) || 0 })
                    }
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(variant.id, option.id)}
                    disabled={variant.options.length === 1}
                    className="text-xs font-semibold uppercase tracking-wide text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:text-zinc-300"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addOption(variant.id)}
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              + Tambah opsi
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addVariant}
        className="inline-flex items-center justify-center rounded-full border border-dashed border-emerald-300 px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:border-emerald-500 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        + Tambah Varian
      </button>
    </div>
  );
}
