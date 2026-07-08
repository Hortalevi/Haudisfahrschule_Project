import "server-only";
import { apiGet, ApiError } from "@/lib/api";
import type { Course } from "@/content/courses";

export type CourseDashboardRow = Course & {
  costPerSession: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getAllCourses(): Promise<Course[]> {
  return apiGet<Course[]>("/public/courses");
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    return await apiGet<Course>(`/public/courses/${slug}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

// Dashboard-only: includes inactive courses and raw DB fields (costPerSession).
export async function getAllCoursesForDashboard(): Promise<CourseDashboardRow[]> {
  return apiGet<CourseDashboardRow[]>("/courses");
}

export async function getCourseRowBySlug(slug: string): Promise<CourseDashboardRow | null> {
  try {
    return await apiGet<CourseDashboardRow>(`/courses/${slug}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
