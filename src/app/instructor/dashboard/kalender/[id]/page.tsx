import { notFound } from "next/navigation";
import { getCourseDateById } from "@/lib/course-dates";
import { getAllCoursesForDashboard } from "@/lib/courses";
import { getAllInstructors } from "@/lib/users";
import { listToText } from "@/lib/course-content-format";
import { toDatetimeLocalValue } from "@/lib/utils";
import { CourseDateForm } from "../course-date-form";
import { updateCourseDate } from "../actions";
import { DeleteCourseDateButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function EditCourseDatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [date, courses, instructors] = await Promise.all([
    getCourseDateById(id),
    getAllCoursesForDashboard(),
    getAllInstructors(),
  ]);
  if (!date) notFound();

  const boundUpdate = updateCourseDate.bind(null, date.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">Termin bearbeiten</h1>
          <p className="mt-1 text-sm text-sand-600">{date.courseTitle}</p>
        </div>
        <DeleteCourseDateButton id={date.id} />
      </div>

      <CourseDateForm
        action={boundUpdate}
        submitLabel="Änderungen speichern"
        courses={courses}
        instructors={instructors}
        initial={{
          courseSlug: date.courseSlug,
          dateLabel: date.dateLabel,
          timeSlotsText: listToText(date.timeSlots),
          startsAt: toDatetimeLocalValue(date.startsAt),
          endsAt: date.endsAt ? toDatetimeLocalValue(date.endsAt) : "",
          location: date.location,
          price: date.price,
          capacity: date.capacity,
          instructorId: date.instructorId ?? "",
          notes: date.notes ?? "",
        }}
      />
    </div>
  );
}
