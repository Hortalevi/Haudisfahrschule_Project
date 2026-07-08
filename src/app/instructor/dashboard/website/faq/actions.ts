"use server";

import { revalidatePath } from "next/cache";
import { apiMutate, ApiError } from "@/lib/api";

export type FaqActionState = { error?: string } | undefined;

function toRequest(formData: FormData) {
  return {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

function revalidate() {
  revalidatePath("/instructor/dashboard/website/faq");
  revalidatePath("/");
}

export async function createFaqItem(_state: FaqActionState, formData: FormData): Promise<FaqActionState> {
  try {
    await apiMutate("/content/faq", "POST", toRequest(formData));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}

export async function updateFaqItem(id: string, _state: FaqActionState, formData: FormData): Promise<FaqActionState> {
  try {
    await apiMutate(`/content/faq/${id}`, "PUT", toRequest(formData));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}

export async function deleteFaqItem(id: string) {
  await apiMutate(`/content/faq/${id}`, "DELETE");
  revalidate();
}
