import { Card } from "@/components/ui/card";
import { getRevenueBreakdown } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function UmsatzPage() {
  const stats = await getRevenueBreakdown();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Umsatz</h1>
      <p className="mt-1 text-sm text-sand-600">Einnahmen, Kosten und Gewinn pro Kurs (alle Termine).</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-sand-500">Gesamtumsatz</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy-950">CHF {stats.totalRevenue}.–</p>
        </Card>
        <Card>
          <p className="text-xs text-sand-500">Gesamtkosten</p>
          <p className="mt-1 font-display text-2xl font-bold text-navy-950">CHF {stats.totalCost}.–</p>
        </Card>
        <Card>
          <p className="text-xs text-sand-500">Gewinn</p>
          <p className="mt-1 font-display text-2xl font-bold text-ember-800">CHF {stats.totalProfit}.–</p>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-display text-lg font-bold text-navy-950">Pro Kurs</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-sand-500">
                <th className="py-2 pr-3">Kurs</th>
                <th className="py-2 pr-3">Termine</th>
                <th className="py-2 pr-3">Studierende</th>
                <th className="py-2 pr-3">Umsatz</th>
                <th className="py-2 pr-3">Kosten</th>
                <th className="py-2">Gewinn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-900/8">
              {stats.perCourse.map((c) => (
                <tr key={c.slug}>
                  <td className="py-2.5 pr-3 font-semibold text-navy-900">{c.title}</td>
                  <td className="py-2.5 pr-3 text-sand-600">{c.sessions}</td>
                  <td className="py-2.5 pr-3 text-sand-600">{c.students}</td>
                  <td className="py-2.5 pr-3 text-sand-600">CHF {c.revenue}.–</td>
                  <td className="py-2.5 pr-3 text-sand-600">CHF {c.cost}.–</td>
                  <td className="py-2.5 font-semibold text-ember-800">CHF {c.profit}.–</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
