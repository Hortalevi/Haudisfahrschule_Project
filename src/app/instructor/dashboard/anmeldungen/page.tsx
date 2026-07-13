import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getAllCourseDatesForDashboard } from "@/lib/course-dates";
import { getAllRegistrations, type RegistrationRow as RegistrationRowData } from "@/lib/registrations";
import { getAllInstructors } from "@/lib/users";
import { RegistrationRow } from "./registration-row";
import { AddRegistrationForm } from "./add-registration-form";

export const dynamic = "force-dynamic";

export default async function AnmeldungenPage() {
  const [dates, registrations, instructors] = await Promise.all([
    getAllCourseDatesForDashboard(),
    getAllRegistrations(),
    getAllInstructors(),
  ]);

  const registrationsByDate = new Map<string, RegistrationRowData[]>();
  for (const r of registrations) {
    registrationsByDate.set(r.courseDateId, [...(registrationsByDate.get(r.courseDateId) ?? []), r]);
  }

  const withRegistrations = dates.map((d) => ({ ...d, registrations: registrationsByDate.get(d.id) ?? [] }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Anmeldungen</h1>
      <p className="mt-1 text-sm text-sand-600">Wer sich für welchen Kurstermin angemeldet hat.</p>

      <div className="mt-6 rounded-xl border border-navy-900/8 bg-white px-5 shadow-soft">
        {withRegistrations.length === 0 ? (
          <p className="py-6 text-sm text-sand-600">Noch keine Kurstermine.</p>
        ) : (
          <Accordion type="multiple" defaultValue={[withRegistrations[0]?.id ?? ""]}>
            {withRegistrations.map((date) => {
              const confirmed = date.registrations.filter((r) => r.status === "CONFIRMED").length;
              return (
                <AccordionItem key={date.id} value={date.id}>
                  <AccordionTrigger>
                    <span className="flex flex-1 items-center justify-between gap-3 pr-3">
                      <span>
                        {date.courseTitle}
                        <span className="ml-2 text-sm font-normal text-sand-500">{date.dateLabel}</span>
                      </span>
                      <Badge variant={confirmed >= date.capacity ? "navy" : "ember"}>
                        {confirmed}/{date.capacity} Plätze
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {date.registrations.length === 0 ? (
                      <p className="pb-3 text-sm text-sand-600">Noch keine Anmeldungen.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="text-xs uppercase tracking-wide text-sand-500">
                              <th className="py-2 pr-3">Name</th>
                              <th className="py-2 pr-3">E-Mail</th>
                              <th className="py-2 pr-3">Telefon</th>
                              <th className="py-2 pr-3">Sprache</th>
                              <th className="py-2 pr-3">Empfehlung</th>
                              <th className="py-2 pr-3">Zahlung</th>
                              <th className="py-2 pr-3">Notiz</th>
                              <th className="py-2 pr-3">Status</th>
                              <th className="py-2" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-navy-900/8">
                            {date.registrations.map((r) => (
                              <RegistrationRow key={r.id} registration={r} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <AddRegistrationForm courseDateId={date.id} instructors={instructors} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}
