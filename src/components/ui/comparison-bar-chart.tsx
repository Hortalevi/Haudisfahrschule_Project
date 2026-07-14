import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ComparisonBarChartRow = {
  key: string;
  label: string;
  value: number;
  valueLabel: string;
  // Omit for a single-series chart (default accent, no direct labels needed
  // beyond the row label). Pass per-row to encode categorical identity - each
  // row's own label already sits beside its bar, so no separate legend box.
  color?: string;
};

// Horizontal bars, sorted descending - the form for ranking a handful of named
// categories by magnitude. The top row gets a "leader" badge so the highlight
// ("most Anmeldungen", "most revenue", ...) doesn't require reading the axis.
export function ComparisonBarChart({
  rows,
  emptyLabel = "Noch keine Daten.",
}: {
  rows: ComparisonBarChartRow[];
  emptyLabel?: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-sand-600">{emptyLabel}</p>;
  }

  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(1, ...sorted.map((r) => r.value));

  return (
    <div className="space-y-4">
      {sorted.map((row, i) => {
        const pct = Math.max(2, Math.round((row.value / maxValue) * 100));
        const color = row.color ?? "var(--color-ember-500)";
        return (
          <div key={row.key}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-navy-900">
                {i === 0 && row.value > 0 && (
                  <Crown className="h-3.5 w-3.5 shrink-0 text-yellow-500" aria-hidden="true" />
                )}
                {row.color && (
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                )}
                {row.label}
              </span>
              <span className="tabular-nums text-sand-600">{row.valueLabel}</span>
            </div>
            <div className="mt-1.5 h-5 w-full bg-sand-100">
              <div
                className={cn("h-full rounded-r-[4px]")}
                style={{ width: `${pct}%`, backgroundColor: color }}
                role="img"
                aria-label={`${row.label}: ${row.valueLabel}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
