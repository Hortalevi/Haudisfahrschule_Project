import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false, follow: true },
  alternates: { canonical: "/datenschutz" },
};

export default async function DatenschutzPage() {
  const site = await getSiteSettings();

  return (
    <Section className="pt-16 sm:pt-20">
      <Container className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-navy-950">Datenschutzerklärung</h1>

        <div className="mt-8 space-y-6 leading-relaxed text-sand-700">
          <section>
            <h2 className="font-display text-lg font-bold text-navy-950">Verantwortliche Stelle</h2>
            <p>
              {site.legalName}, {site.addressStreet}, {site.addressPostalCode} {site.addressCity}.
              Kontakt: {site.email}, {site.phoneDisplay}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-950">Welche Daten wir bearbeiten</h2>
            <p>
              Wenn du unser Anmeldeformular (Kursdaten &amp; Anmeldung) oder Kontaktformular
              nutzt, bearbeiten wir die von dir angegebenen Daten (z. B. Name, E-Mail, Telefon,
              Kurswahl, Nachricht), um deine Anfrage bzw. Kursanmeldung zu bearbeiten und dich zu
              kontaktieren.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-950">Aufbewahrung</h2>
            <p>
              Wir bewahren deine Daten nur so lange auf, wie es für die Bearbeitung deiner Anfrage
              bzw. Kursanmeldung sowie zur Erfüllung gesetzlicher Aufbewahrungspflichten
              notwendig ist.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-950">Deine Rechte</h2>
            <p>
              Du hast das Recht auf Auskunft, Berichtigung und Löschung deiner bei uns
              gespeicherten Daten. Wende dich dazu an {site.email}.
            </p>
          </section>

          <p className="rounded-md bg-sand-100 p-4 text-sm text-sand-600">
            Platzhalter-Inhalt gemäss revidiertem Schweizer Datenschutzgesetz (nDSG). Vor dem
            Live-Schalten durch eine Rechtsberatung prüfen und an die effektiv eingesetzten
            Systeme (z. B. Formular-Backend, Hosting bei Render, allfällige E-Mail-Dienste)
            anpassen lassen.
          </p>
        </div>
      </Container>
    </Section>
  );
}
