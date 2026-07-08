import "server-only";
import { apiGet } from "@/lib/api";

export async function getAllInstructors(): Promise<{ id: string; name: string }[]> {
  return apiGet<{ id: string; name: string }[]>("/instructors");
}
