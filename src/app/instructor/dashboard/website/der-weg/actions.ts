"use server";

import { revalidatePath } from "next/cache";
import { apiMutate, ApiError } from "@/lib/api";

export type ProcessStepActionState = { error?: string } | undefined;

function toRequest(formData: FormData) {
  return {
    step: Number(formData.get("step") ?? 1),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

function revalidate() {
  revalidatePath("/instructor/dashboard/website/der-weg");
  revalidatePath("/der-weg");
  revalidatePath("/");
}

export async function createProcessStep(
  _state: ProcessStepActionState,
  formData: FormData,
): Promise<ProcessStepActionState> {
  try {
    await apiMutate("/content/process-steps", "POST", toRequest(formData));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}

export async function updateProcessStep(
  id: string,
  _state: ProcessStepActionState,
  formData: FormData,
): Promise<ProcessStepActionState> {
  try {
    await apiMutate(`/content/process-steps/${id}`, "PUT", toRequest(formData));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}

export async function deleteProcessStep(id: string) {
  await apiMutate(`/content/process-steps/${id}`, "DELETE");
  revalidate();
}
