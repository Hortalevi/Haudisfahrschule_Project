"use server";

import { revalidatePath } from "next/cache";
import { apiMutate } from "@/lib/api";

export async function cancelRegistration(id: string) {
  await apiMutate(`/registrations/${id}/cancel`, "PATCH");
  revalidatePath("/instructor/dashboard/anmeldungen");
  revalidatePath("/kursdaten-anmeldung");
}
