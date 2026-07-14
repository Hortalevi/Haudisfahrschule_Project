"use server";

import { revalidatePath } from "next/cache";
import { apiMutate, ApiError } from "@/lib/api";

export type UserActionState = { error?: string } | undefined;

export async function createUser(_state: UserActionState, formData: FormData): Promise<UserActionState> {
  const request = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    isAdmin: formData.get("isAdmin") === "on",
    isInstructor: formData.get("isInstructor") === "on",
  };

  try {
    await apiMutate("/users", "POST", request);
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidatePath("/instructor/dashboard/benutzer");
}

export async function updateUserRoles(id: string, isAdmin: boolean, isInstructor: boolean): Promise<UserActionState> {
  try {
    await apiMutate(`/users/${id}/roles`, "PATCH", { isAdmin, isInstructor });
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidatePath("/instructor/dashboard/benutzer");
}

export async function updateUserColor(id: string, color: string): Promise<UserActionState> {
  try {
    await apiMutate(`/users/${id}/color`, "PATCH", { color });
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidatePath("/instructor/dashboard/benutzer");
  revalidatePath("/instructor/dashboard/kalender");
  revalidatePath("/instructor/dashboard/statistik");
}

export async function deleteUser(id: string): Promise<UserActionState> {
  try {
    await apiMutate(`/users/${id}`, "DELETE");
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  revalidatePath("/instructor/dashboard/benutzer");
}
