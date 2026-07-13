import type { RevenueBreakdown } from "@/lib/stats";

// Horizontal bars: clearest form for comparing a magnitude (revenue) across a
// handful of named categories (courses). Single series, so no legend - the
// card title already says what's plotted (see marks-and-anatomy: "a single
// series needs no legend box").
export function RevenueChart({ perCourse }: { perCourse: RevenueBreakdown["perCourse"] }) {
  const maxRevenue = Math.max(1, ...perCourse.map((c) => c.revenue));

  return (
    <div className="space-y-4">
      {perCourse.map((c) => {
        const pct = Math.max(2, Math.round((c.revenue / maxRevenue) * 100));
        return (
          <div key={c.slug}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold text-navy-900">{c.title}</span>
              <span className="tabular-nums text-sand-600">CHF {c.revenue}.–</span>
            </div>
            <div className="mt-1.5 h-5 w-full bg-sand-100">
              <div
                className="h-full rounded-r-[4px] bg-ember-500"
                style={{ width: `${pct}%` }}
                role="img"
                aria-label={`${c.title}: CHF ${c.revenue}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
