"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarEntry = {
  id: string;
  title: string;
  startsAt: string;
  location: string;
  instructorName: string | null;
  instructorColor: string | null;
  seatsLabel: string;
};

// Fallback for dates nobody's assigned to yet - a neutral gray distinct from
// every instructor's own (never-gray) palette slot, see InstructorColors.PALETTE.
const UNASSIGNED_COLOR = "#8a8a8a";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function startOfMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday = 0
  const gridStart = new Date(year, month, 1 - startOffset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function CalendarMonth({ entries }: { entries: CalendarEntry[] }) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const days = useMemo(() => startOfMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const entry of entries) {
      const d = new Date(entry.startsAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      map.set(key, [...(map.get(key) ?? []), entry]);
    }
    return map;
  }, [entries]);

  // Legend: one entry per instructor actually teaching something this data set,
  // in first-seen order - so color is never the only way to tell who's who.
  const legend = useMemo(() => {
    const seen = new Map<string, { name: string; color: string }>();
    let hasUnassigned = false;
    for (const entry of entries) {
      if (!entry.instructorName || !entry.instructorColor) {
        hasUnassigned = true;
        continue;
      }
      if (!seen.has(entry.instructorName)) {
        seen.set(entry.instructorName, { name: entry.instructorName, color: entry.instructorColor });
      }
    }
    const items = Array.from(seen.values());
    if (hasUnassigned) items.push({ name: "Kein Fahrlehrer zugewiesen", color: UNASSIGNED_COLOR });
    return items;
  }, [entries]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
            aria-label="Vorheriger Monat"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="w-48 text-center font-display text-lg font-bold text-navy-950">
            {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
            aria-label="Nächster Monat"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button asChild size="sm">
          <Link href="/instructor/dashboard/kalender/neu">
            <Plus className="h-4 w-4" />
            Termin
          </Link>
        </Button>
      </div>

      {legend.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {legend.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs font-semibold text-navy-800">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-7 gap-1.5 text-xs font-semibold text-sand-500">
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-1 pb-1 text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
          const dayEntries = byDay.get(key) ?? [];
          const inMonth = day.getMonth() === cursor.getMonth();
          const isToday = sameDay(day, today);

          return (
            <div
              key={key}
              className={cn(
                "min-h-24 rounded-lg border p-1.5",
                inMonth ? "border-navy-900/8 bg-white" : "border-transparent bg-sand-100/60",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold",
                  isToday ? "bg-ember-700 text-white" : inMonth ? "text-navy-900" : "text-sand-400",
                )}
              >
                {day.getDate()}
              </span>
              <div className="mt-1 space-y-1">
                {dayEntries.map((entry) => {
                  const color = entry.instructorColor ?? UNASSIGNED_COLOR;
                  return (
                    <Link
                      key={entry.id}
                      href={`/instructor/dashboard/kalender/${entry.id}`}
                      className="focus-ring block truncate rounded border-l-[3px] px-1.5 py-1 text-[0.7rem] font-semibold text-navy-900 hover:brightness-95"
                      style={{ backgroundColor: hexToRgba(color, 0.14), borderLeftColor: color }}
                      title={`${entry.title} · ${entry.instructorName ?? "Kein Fahrlehrer zugewiesen"} · ${entry.location} · ${entry.seatsLabel}`}
                    >
                      {entry.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
