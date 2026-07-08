"use server";

import { revalidatePath } from "next/cache";
import { apiMutate, ApiError } from "@/lib/api";

export type GalleryActionState = { error?: string } | undefined;

function toRequest(formData: FormData) {
  return {
    src: String(formData.get("src") ?? "").trim(),
    alt: String(formData.get("alt") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

function revalidate() {
  revalidatePath("/instructor/dashboard/website/galerie");
  revalidatePath("/galerie");
  revalidatePath("/");
}

export async function createGalleryImage(_state: GalleryActionState, formData: FormData): Promise<GalleryActionState> {
  try {
    await apiMutate("/content/gallery", "POST", toRequest(formData));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}

export async function updateGalleryImage(
  id: string,
  _state: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    await apiMutate(`/content/gallery/${id}`, "PUT", toRequest(formData));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}

export async function deleteGalleryImage(id: string) {
  await apiMutate(`/content/gallery/${id}`, "DELETE");
  revalidate();
}
