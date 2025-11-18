"use server";

import { revalidatePath } from "next/cache";
import { deleteTestimonial, upsertTestimonial } from "@/data/testimonials";
import { z } from "zod";

const UpsertTestimonialSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  handle: z.string().nullable().optional(),
  message: z.string(),
  rating: z.number(),
  source: z
    .enum(["instagram", "tiktok", "whatsapp", "google"])
    .optional(),
  sortOrder: z.number(),
});

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function upsertTestimonialAction(
  formData: FormData,
): Promise<ActionResponse> {
  const id = formData.get("id")?.toString();
  const data = {
    id: id ? Number(id) : undefined,
    name: formData.get("name")?.toString().trim(),
    handle: formData.get("handle")?.toString() ?? undefined,
    message: formData.get("message")?.toString().trim(),
    rating: Number(formData.get("rating") ?? 0),
    source: formData.get("source")?.toString(),
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };

  const parsed = UpsertTestimonialSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Gagal menyimpan testimoni, data tidak valid",
    };
  }

  try {
    await upsertTestimonial(parsed.data);
    revalidatePath("/dashboard/testimonials");
    return {
      success: true,
      message: "Testimoni berhasil disimpan",
    };
  } catch (error) {
    console.error("upsertTestimonialAction error", error);
    return {
      success: false,
      message: "Gagal menyimpan testimoni",
    };
  }
}

export async function deleteTestimonialAction(
  formData: FormData,
): Promise<ActionResponse> {
  const id = formData.get("id");
  if (!id) {
    return {
      success: false,
      message: "Gagal menghapus testimoni, ID tidak ditemukan",
    };
  }

  try {
    await deleteTestimonial(Number(id));
    revalidatePath("/dashboard/testimonials");
    return {
      success: true,
      message: "Testimoni berhasil dihapus",
    };
  } catch (error) {
    console.error("deleteTestimonialAction error", error);
    return {
      success: false,
      message: "Gagal menghapus testimoni",
    };
  }
}
