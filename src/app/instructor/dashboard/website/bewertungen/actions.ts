"use server";

import { revalidatePath } from "next/cache";
import { apiMutate, ApiError } from "@/lib/api";

export type TestimonialActionState = { error?: string } | undefined;

function toRequest(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    course: String(formData.get("course") ?? "").trim(),
    rating: Number(formData.get("rating") ?? 5),
    quote: String(formData.get("quote") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

function revalidate() {
  revalidatePath("/instructor/dashboard/website/bewertungen");
  revalidatePath("/");
}

export async function createTestimonial(
  _state: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  try {
    await apiMutate("/content/testimonials", "POST", toRequest(formData));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}

export async function updateTestimonial(
  id: string,
  _state: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  try {
    await apiMutate(`/content/testimonials/${id}`, "PUT", toRequest(formData));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}

export async function deleteTestimonial(id: string) {
  await apiMutate(`/content/testimonials/${id}`, "DELETE");
  revalidate();
}
