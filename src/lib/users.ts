import "server-only";
import { apiGet } from "@/lib/api";

export type InstructorSummary = { id: string; name: string; username: string; color: string };

export async function getAllInstructors(): Promise<InstructorSummary[]> {
  return apiGet<InstructorSummary[]>("/instructors");
}

// Public - names only, for the "who recommended you" dropdown on the sign-up
// form. Refetched on every page load (no cache), so a newly added instructor
// shows up immediately without a redeploy.
export async function getPublicInstructors(): Promise<{ id: string; name: string }[]> {
  return apiGet<{ id: string; name: string }[]>("/public/instructors");
}
