"use server";

import { revalidatePath } from "next/cache";
import { apiMutate, ApiError } from "@/lib/api";
import { textToList } from "@/lib/course-content-format";

export type RegulationActionState = { error?: string } | undefined;

function toRequest(formData: FormData) {
  return {
    vehicleType: String(formData.get("vehicleType") ?? "AUTO"),
    question: String(formData.get("question") ?? "").trim(),
    answer: textToList(String(formData.get("answerText") ?? "")),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

function revalidate() {
  revalidatePath("/instructor/dashboard/website/vorschriften");
  revalidatePath("/vorschriften/auto");
  revalidatePath("/vorschriften/motorrad");
}

export async function createRegulation(
  _state: RegulationActionState,
  formData: FormData,
): Promise<RegulationActionState> {
  try {
    await apiMutate("/content/regulations", "POST", toRequest(formData));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}

export async function updateRegulation(
  id: string,
  _state: RegulationActionState,
  formData: FormData,
): Promise<RegulationActionState> {
  try {
    await apiMutate(`/content/regulations/${id}`, "PUT", toRequest(formData));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}

export async function deleteRegulation(id: string) {
  await apiMutate(`/content/regulations/${id}`, "DELETE");
  revalidate();
}
