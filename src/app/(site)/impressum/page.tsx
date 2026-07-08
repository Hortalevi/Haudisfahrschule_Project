import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
  alternates: { canonical: "/impressum" },
};

export default async function ImpressumPage() {
  const site = await getSiteSettings();

  return (
    <Section className="pt-16 sm:pt-20">
      <Container className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-navy-950">Impressum</h1>

        <div className="mt-8 space-y-6 leading-relaxed text-sand-700">
          <section>
            <h2 className="font-display text-lg font-bold text-navy-950">Anbieterin</h2>
            <p>
              {site.legalName}
              <br />
              {site.addressStreet}
              <br />
              {site.addressPostalCode} {site.addressCity}, Schweiz
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-950">Kontakt</h2>
            <p>
              Telefon: {site.phoneDisplay}
              <br />
              E-Mail: {site.email}
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-950">Haftungsausschluss</h2>
            <p>
              Alle Angaben auf dieser Website erfolgen ohne Gewähr. {site.legalName} übernimmt
              keine Haftung für die Aktualität, Richtigkeit und Vollständigkeit der
              bereitgestellten Informationen.
            </p>
          </section>

          <p className="rounded-md bg-sand-100 p-4 text-sm text-sand-600">
            Platzhalter-Inhalt: Vor dem Live-Schalten der Website durch Bruno &amp; Ausilia
            Haudenschild bzw. eine Rechtsberatung prüfen und vervollständigen lassen (u. a.
            Handelsregistereintrag/UID-Nummer, falls vorhanden).
          </p>
        </div>
      </Container>
    </Section>
  );
}
