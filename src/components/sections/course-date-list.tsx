"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CourseDate } from "@/content/course-dates";
import type { Course } from "@/content/courses";
import { cn } from "@/lib/utils";

const seatLabel: Record<string, string> = {
  viele: "Viele Plätze frei",
  wenige: "Wenige Plätze frei",
  ausgebucht: "Ausgebucht",
};

export function CourseDateList({
  dates,
  courses,
  onSelect,
}: {
  dates: CourseDate[];
  courses: Course[];
  onSelect: (courseDateId: string) => void;
}) {
  const [filter, setFilter] = useState("all");

  const filterOptions = useMemo(
    () => [
      { value: "all", label: "Alle Kurse" },
      ...courses
        .filter((c) => dates.some((d) => d.courseSlug === c.slug))
        .map((c) => ({ value: c.slug, label: c.title })),
    ],
    [courses, dates],
  );

  const filtered = useMemo(
    () => (filter === "all" ? dates : dates.filter((d) => d.courseSlug === filter)),
    [filter, dates],
  );

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-navy-950">Verfügbare Kurstermine</h2>
      <div className="mt-6 flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={cn(
              "focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              filter === option.value
                ? "border-navy-950 bg-navy-950 text-white"
                : "border-navy-900/15 text-navy-800 hover:bg-navy-900/5",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="flex flex-col justify-between rounded-xl border border-navy-900/8 bg-white p-5 shadow-soft"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-bold text-navy-950">{d.courseName}</h3>
                <Badge variant={d.seatStatus === "ausgebucht" ? "navy" : d.seatStatus === "wenige" ? "ember" : "moss"}>
                  {seatLabel[d.seatStatus]}
                </Badge>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-sand-600">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-navy-500" />
                  {d.dateLabel}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-navy-500" />
                  {d.timeSlots.join(" · ")}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-navy-500" />
                  {d.location}
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="font-display text-lg font-bold text-navy-950">
                {d.price === 0 ? "Gratis" : `CHF ${d.price}.–`}
              </span>
              <Button
                size="sm"
                disabled={d.seatStatus === "ausgebucht"}
                onClick={() => onSelect(d.id)}
              >
                {d.seatStatus === "ausgebucht" ? "Ausgebucht" : "Anmelden"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
