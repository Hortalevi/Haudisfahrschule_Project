// Course-date content is admin-editable and DB-backed now (see src/lib/course-dates.ts).
// Only the shared type remains here.

export type SeatStatus = "viele" | "wenige" | "ausgebucht";

export type CourseDate = {
  id: string;
  courseSlug: string;
  courseName: string;
  dateLabel: string;
  timeSlots: string[];
  location: string;
  price: number;
  seatStatus: SeatStatus;
};
