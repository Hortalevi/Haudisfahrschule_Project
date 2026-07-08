"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiMutate, ApiError } from "@/lib/api";
import { courseDateFormSchema } from "@/lib/schemas";
import { textToList } from "@/lib/course-content-format";

export type CourseDateFormState = { error?: string } | undefined;

function parseForm(formData: FormData) {
  return courseDateFormSchema.safeParse({
    courseSlug: formData.get("courseSlug"),
    dateLabel: formData.get("dateLabel"),
    timeSlotsText: formData.get("timeSlotsText"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    location: formData.get("location"),
    price: formData.get("price"),
    capacity: formData.get("capacity"),
    instructorId: formData.get("instructorId"),
    notes: formData.get("notes"),
  });
}

function toCourseDateRequest(data: ReturnType<typeof parseForm>["data"] & object) {
  return {
    courseSlug: data.courseSlug,
    dateLabel: data.dateLabel,
    timeSlots: textToList(data.timeSlotsText),
    startsAt: new Date(data.startsAt).toISOString(),
    endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : null,
    location: data.location,
    price: data.price,
    capacity: data.capacity,
    instructorId: data.instructorId || null,
    notes: data.notes || null,
  };
}

export async function createCourseDate(
  _state: CourseDateFormState,
  formData: FormData,
): Promise<CourseDateFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };

  try {
    await apiMutate("/course-dates", "POST", toCourseDateRequest(parsed.data));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }

  revalidatePath("/kursdaten-anmeldung");
  redirect("/instructor/dashboard/kalender");
}

export async function updateCourseDate(
  id: string,
  _state: CourseDateFormState,
  formData: FormData,
): Promise<CourseDateFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };

  try {
    await apiMutate(`/course-dates/${id}`, "PUT", toCourseDateRequest(parsed.data));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }

  revalidatePath("/kursdaten-anmeldung");
  redirect("/instructor/dashboard/kalender");
}

export async function deleteCourseDate(id: string) {
  await apiMutate(`/course-dates/${id}`, "DELETE");
  revalidatePath("/kursdaten-anmeldung");
}
