"use server";

import { revalidatePath } from "next/cache";
import { apiMutate, ApiError } from "@/lib/api";

export type RegistrationActionState = { error?: string } | undefined;

function revalidate() {
  revalidatePath("/instructor/dashboard/anmeldungen");
  revalidatePath("/kursdaten-anmeldung");
}

export async function cancelRegistration(id: string) {
  await apiMutate(`/registrations/${id}/cancel`, "PATCH");
  revalidate();
}

export async function deleteRegistration(id: string) {
  await apiMutate(`/registrations/${id}`, "DELETE");
  revalidate();
}

export async function setPaymentStatus(id: string, paid: boolean) {
  await apiMutate(`/registrations/${id}/payment-status`, "PATCH", { paid });
  revalidate();
}

export async function setNotes(id: string, notes: string) {
  await apiMutate(`/registrations/${id}/notes`, "PATCH", { notes });
  revalidate();
}

export async function createRegistration(
  _state: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  const recommendedInstructorId = String(formData.get("recommendedInstructorId") ?? "");
  try {
    await apiMutate("/registrations", "POST", {
      courseDateId: String(formData.get("courseDateId") ?? ""),
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      language: String(formData.get("language") ?? "Deutsch"),
      recommendedInstructorId: recommendedInstructorId || undefined,
    });
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidate();
}
