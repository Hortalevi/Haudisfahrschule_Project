"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiMutate } from "@/lib/api";

export async function logoutInstructor() {
  // JWTs are stateless, so there's no server-side session to invalidate -
  // clearing the cookie locally is enough (matches Java's own /auth/logout,
  // which does the same thing for the client-side login flow).
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/instructor/login");
}

// Self-service account deletion (admin or instructor). The backend rejects
// this with 409 if the caller is the last remaining admin. Deliberately does
// NOT call redirect() itself - the caller (a client component) needs to
// distinguish "failed, show the error" from "succeeded, navigate away", and
// throwing through next/navigation's redirect() would be caught by its try/catch.
export async function deleteOwnAccount() {
  await apiMutate("/users/me", "DELETE");
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
