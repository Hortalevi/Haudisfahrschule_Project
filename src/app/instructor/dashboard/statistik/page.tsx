import { Card } from "@/components/ui/card";
import { ComparisonBarChart } from "@/components/ui/comparison-bar-chart";
import { getRevenueBreakdown, getCommissionBreakdown } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function StatistikPage() {
  const [revenue, commissions] = await Promise.all([getRevenueBreakdown(), getCommissionBreakdown()]);

  const courseAnmeldungen = revenue.perCourse.map((c) => ({
    key: c.slug,
    label: c.title,
    value: c.registrations,
    valueLabel: `${c.registrations}`,
  }));
  const courseStudents = revenue.perCourse.map((c) => ({
    key: c.slug,
    label: c.title,
    value: c.students,
    valueLabel: `${c.students}`,
  }));
  const courseRevenue = revenue.perCourse.map((c) => ({
    key: c.slug,
    label: c.title,
    value: c.revenue,
    valueLabel: `CHF ${c.revenue}.–`,
  }));

  const instructorAnmeldungen = commissions.instructors.map((i) => ({
    key: i.id,
    label: i.name,
    value: i.registrationsAssigned,
    valueLabel: `${i.registrationsAssigned}`,
    color: i.color,
  }));
  const instructorStudents = commissions.instructors.map((i) => ({
    key: i.id,
    label: i.name,
    value: i.studentsAssigned,
    valueLabel: `${i.studentsAssigned}`,
    color: i.color,
  }));
  const instructorRevenue = commissions.instructors.map((i) => ({
    key: i.id,
    label: i.name,
    value: i.revenueGenerated,
    valueLabel: `CHF ${i.revenueGenerated}.–`,
    color: i.color,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Statistik</h1>
      <p className="mt-1 text-sm text-sand-600">
        Kurse und Fahrlehrer/-innen im Vergleich - welche(r) am meisten Anmeldungen, Studierende und Umsatz bringt.
      </p>

      <h2 className="mt-8 font-display text-lg font-bold text-navy-950">Kurse im Vergleich</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-display font-bold text-navy-950">Anmeldungen pro Kurs</h3>
          <p className="mt-1 text-xs text-sand-500">Alle Anmeldungen, auch stornierte.</p>
          <div className="mt-5">
            <ComparisonBarChart rows={courseAnmeldungen} />
          </div>
        </Card>
        <Card>
          <h3 className="font-display font-bold text-navy-950">Studierende pro Kurs</h3>
          <p className="mt-1 text-xs text-sand-500">Nur bestätigte Anmeldungen.</p>
          <div className="mt-5">
            <ComparisonBarChart rows={courseStudents} />
          </div>
        </Card>
        <Card>
          <h3 className="font-display font-bold text-navy-950">Umsatz pro Kurs</h3>
          <p className="mt-1 text-xs text-sand-500">Über alle Termine hinweg.</p>
          <div className="mt-5">
            <ComparisonBarChart rows={courseRevenue} />
          </div>
        </Card>
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-navy-950">Fahrlehrer/-innen im Vergleich</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-display font-bold text-navy-950">Anmeldungen pro Fahrlehrer/-in</h3>
          <p className="mt-1 text-xs text-sand-500">Zugewiesene Anmeldungen, auch stornierte.</p>
          <div className="mt-5">
            <ComparisonBarChart rows={instructorAnmeldungen} />
          </div>
        </Card>
        <Card>
          <h3 className="font-display font-bold text-navy-950">Studierende pro Fahrlehrer/-in</h3>
          <p className="mt-1 text-xs text-sand-500">Nur bestätigte Anmeldungen.</p>
          <div className="mt-5">
            <ComparisonBarChart rows={instructorStudents} />
          </div>
        </Card>
        <Card>
          <h3 className="font-display font-bold text-navy-950">Umsatz pro Fahrlehrer/-in</h3>
          <p className="mt-1 text-xs text-sand-500">Basis für die Provisionsauszahlung.</p>
          <div className="mt-5">
            <ComparisonBarChart rows={instructorRevenue} />
          </div>
        </Card>
      </div>
    </div>
  );
}
