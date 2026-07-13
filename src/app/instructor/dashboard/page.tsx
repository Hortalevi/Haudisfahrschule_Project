import Link from "next/link";
import { BookOpen, CalendarDays, Users, Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getOverviewStats } from "@/lib/stats";
import { getCurrentUser } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const [user, stats] = await Promise.all([getCurrentUser(), getOverviewStats()]);

  const tiles = [
    { label: "Aktive Angebote", value: stats.activeCourses, icon: BookOpen },
    { label: "Kommende Termine", value: stats.upcomingDates, icon: CalendarDays },
    { label: "Anmeldungen (Monat)", value: stats.studentsThisMonth, icon: Users },
    // Money is admin-only - the backend already zeroes this for non-admins,
    // but a plain instructor shouldn't see the tile at all.
    ...(user?.isAdmin ? [{ label: "Umsatz (Monat)", value: `CHF ${stats.revenueThisMonth}.–`, icon: Coins }] : []),
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Willkommen, {user?.name}</h1>
      <p className="mt-1 text-sm text-sand-600">Hier ist dein Überblick über Kurse, Termine und Anmeldungen.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.label} className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ember-500/10 text-ember-800">
              <tile.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-navy-950">{tile.value}</p>
              <p className="text-xs text-sand-500">{tile.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="font-display text-lg font-bold text-navy-950">Neueste Anmeldungen</h2>
        {stats.recentRegistrations.length === 0 ? (
          <p className="mt-3 text-sm text-sand-600">Noch keine Anmeldungen.</p>
        ) : (
          <ul className="mt-4 divide-y divide-navy-900/8">
            {stats.recentRegistrations.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <span className="font-semibold text-navy-900">
                    {r.firstName} {r.lastName}
                  </span>
                  <span className="text-sand-500"> · {r.courseTitle}</span>
                </div>
                <span className="text-sand-500">{r.dateLabel}</span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/instructor/dashboard/anmeldungen"
          className="focus-ring mt-4 inline-block text-sm font-semibold text-ember-800 hover:underline"
        >
          Alle Anmeldungen ansehen →
        </Link>
      </Card>
    </div>
  );
}
