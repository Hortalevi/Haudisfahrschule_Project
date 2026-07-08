import { getAllCoursesForDashboard } from "@/lib/courses";
import { getAllInstructors } from "@/lib/users";
import { CourseDateForm } from "../course-date-form";
import { createCourseDate } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewCourseDatePage() {
  const [courses, instructors] = await Promise.all([getAllCoursesForDashboard(), getAllInstructors()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Neuer Termin</h1>
      <p className="mt-1 text-sm text-sand-600">Lege fest, wann und wo ein Kurs stattfindet.</p>

      <CourseDateForm
        action={createCourseDate}
        submitLabel="Termin erstellen"
        courses={courses}
        instructors={instructors}
        initial={{
          courseSlug: courses[0]?.slug ?? "",
          dateLabel: "",
          timeSlotsText: "",
          startsAt: "",
          endsAt: "",
          location: "Verkehrszentrum Baden, Haselstrasse 33",
          price: 0,
          capacity: 12,
          instructorId: "",
          notes: "",
        }}
      />
    </div>
  );
}
