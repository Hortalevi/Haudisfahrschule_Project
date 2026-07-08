"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiMutate, ApiError } from "@/lib/api";
import { courseFormSchema } from "@/lib/schemas";
import { textToList, textToSections } from "@/lib/course-content-format";

export type CourseFormState = { error?: string } | undefined;

function parseForm(formData: FormData) {
  return courseFormSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    tagline: formData.get("tagline"),
    icon: formData.get("icon"),
    category: formData.get("category"),
    audience: formData.get("audience"),
    priceFrom: formData.get("priceFrom"),
    priceUnit: formData.get("priceUnit"),
    priceNote: formData.get("priceNote"),
    summary: formData.get("summary"),
    highlightsText: formData.get("highlightsText"),
    languagesText: formData.get("languagesText"),
    duration: formData.get("duration"),
    ctaLabel: formData.get("ctaLabel"),
    sectionsText: formData.get("sectionsText"),
    costPerSession: formData.get("costPerSession"),
    active: formData.get("active") === "on",
  });
}

function toCourseRequest(data: ReturnType<typeof parseForm>["data"] & object) {
  return {
    slug: data.slug,
    title: data.title,
    tagline: data.tagline,
    icon: data.icon,
    category: data.category,
    audience: data.audience,
    priceFrom: data.priceFrom === "" || data.priceFrom === undefined ? null : Number(data.priceFrom),
    priceUnit: data.priceUnit,
    priceNote: data.priceNote || null,
    summary: data.summary,
    highlights: textToList(data.highlightsText),
    languages: data.languagesText ? textToList(data.languagesText) : null,
    duration: data.duration || null,
    ctaLabel: data.ctaLabel,
    sections: textToSections(data.sectionsText),
    costPerSession: data.costPerSession,
    active: data.active,
  };
}

export async function createCourse(_state: CourseFormState, formData: FormData): Promise<CourseFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };

  try {
    await apiMutate("/courses", "POST", toCourseRequest(parsed.data));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }

  revalidatePath("/kursangebot");
  redirect("/instructor/dashboard/angebote");
}

export async function updateCourse(
  slug: string,
  _state: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  // The slug field is disabled/locked in the edit form (see CourseForm's
  // lockSlug prop) - it's the course's URL and stays immutable after creation.
  formData.set("slug", slug);
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };

  try {
    await apiMutate(`/courses/${slug}`, "PUT", toCourseRequest(parsed.data));
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }

  revalidatePath("/kursangebot");
  revalidatePath(`/kursangebot/${slug}`);
  redirect("/instructor/dashboard/angebote");
}

export async function deleteCourse(slug: string) {
  await apiMutate(`/courses/${slug}`, "DELETE");
  revalidatePath("/kursangebot");
}

export async function toggleCourseActive(slug: string, active: boolean) {
  await apiMutate(`/courses/${slug}/active`, "PATCH", { active });
  revalidatePath("/kursangebot");
}
