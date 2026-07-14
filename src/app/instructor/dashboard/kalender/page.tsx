import { getAllCourseDatesForDashboard } from "@/lib/course-dates";
import { CalendarMonth, type CalendarEntry } from "./calendar-month";

export const dynamic = "force-dynamic";

export default async function KalenderPage() {
  const dates = await getAllCourseDatesForDashboard();

  const entries: CalendarEntry[] = dates.map((d) => ({
    id: d.id,
    title: d.courseTitle,
    startsAt: d.startsAt,
    location: d.location,
    instructorName: d.instructorName,
    instructorColor: d.instructorColor,
    seatsLabel: `${d.confirmedCount}/${d.capacity} Plätze`,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Kalender</h1>
      <p className="mt-1 text-sm text-sand-600">Wann und wo welcher Kurs stattfindet.</p>

      <div className="mt-6 rounded-xl border border-navy-900/8 bg-white p-5 shadow-soft">
        <CalendarMonth entries={entries} />
      </div>
    </div>
  );
}
