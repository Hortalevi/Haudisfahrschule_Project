import "server-only";
import { apiGet, ApiError } from "@/lib/api";
import type { CourseDate } from "@/content/course-dates";

export type CourseDateDashboardRow = {
  id: string;
  courseSlug: string;
  courseTitle: string;
  dateLabel: string;
  timeSlots: string[];
  startsAt: string;
  endsAt: string | null;
  location: string;
  price: number;
  capacity: number;
  instructorId: string | null;
  instructorName: string | null;
  notes: string | null;
  confirmedCount: number;
  createdAt: string;
  updatedAt: string;
};

export async function getAllCourseDates(): Promise<CourseDate[]> {
  return apiGet<CourseDate[]>("/public/course-dates");
}

export async function getDatesForCourse(slug: string): Promise<CourseDate[]> {
  const all = await getAllCourseDates();
  return all.filter((d) => d.courseSlug === slug);
}

// Dashboard-only: full rows with course + instructor + confirmed-count detail,
// used by the calendar, offers, and registrations views (not the public shape above).
export async function getAllCourseDatesForDashboard(): Promise<CourseDateDashboardRow[]> {
  return apiGet<CourseDateDashboardRow[]>("/course-dates");
}

export async function getCourseDateById(id: string): Promise<CourseDateDashboardRow | null> {
  try {
    return await apiGet<CourseDateDashboardRow>(`/course-dates/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
