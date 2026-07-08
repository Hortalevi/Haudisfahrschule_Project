import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ExternalLink, MapPin, Navigation, Phone, TramFront } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { serviceAreas } from "@/content/site";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Standort",
  description:
    "So findest du unser Verkehrszentrum in Baden: Adresse, Anfahrt, Öffnungszeiten und eine Karte zum Standort von Haudis Verkehrsschule.",
  alternates: { canonical: "/standort" },
};

export default async function StandortPage() {
  const site = await getSiteSettings();
  const fullAddress = `${site.addressStreet}, ${site.addressPostalCode} ${site.addressCity}`;
  const mapQuery = encodeURIComponent(fullAddress);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  return (
    <>
      <Section tone="navy" className="pb-14 pt-16 sm:pt-20">
        <Container className="max-w-2xl">
          <Eyebrow tone="light">Standort</Eyebrow>
          <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            So findest du unser Verkehrszentrum
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Mitten in Baden, nur ein paar Gehminuten vom Bahnhof entfernt — mit eigenem
            Parkplatz direkt vor der Tür.
          </p>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[380px_1fr]">
          <div className="space-y-5">
            <Card>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ember-600" />
                <div>
                  <p className="font-display font-bold text-navy-950">Verkehrszentrum Baden</p>
                  <p className="text-sand-700">{fullAddress}</p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="mt-4 w-full">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="h-4 w-4" />
                  Route planen
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-ember-600" />
                <div className="text-sand-700">
                  <p className="font-display font-bold text-navy-950">Öffnungszeiten</p>
                  {site.openingHours.map((h) => (
                    <p key={h.days} className="mt-1">
                      <span className="font-semibold text-navy-900">{h.days}:</span> {h.hours}
                    </p>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <TramFront className="mt-0.5 h-5 w-5 shrink-0 text-ember-600" />
                <div className="text-sand-700">
                  <p className="font-display font-bold text-navy-950">Anreise</p>
                  <p className="mt-1">Ca. 350 m vom Bahnhof Baden entfernt, gut zu Fuss erreichbar.</p>
                  <p className="mt-1">Eigene Parkplätze direkt beim Verkehrszentrum vorhanden.</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-ember-600" />
                <div>
                  <p className="font-display font-bold text-navy-950">Fragen zur Anfahrt?</p>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="focus-ring mt-1 block text-sand-700 hover:text-ember-800"
                  >
                    {site.phoneDisplay}
                  </a>
                </div>
              </div>
            </Card>
          </div>

          <div className="overflow-hidden rounded-xl border-2 border-yellow-400 shadow-elevated">
            <iframe
              title="Standort Haudis Verkehrsschule auf Google Maps"
              src={`https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`}
              className="h-[420px] w-full sm:h-[560px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeading
            eyebrow="Einzugsgebiet"
            title="Auch für Lernende aus der Umgebung von Baden"
            description="Unser Verkehrszentrum ist zentral gelegen und für Lernende aus der ganzen Region gut erreichbar."
          />
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {serviceAreas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-navy-900/10 bg-white px-4 py-2 text-sm font-semibold text-navy-800"
              >
                {area}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-10">
            <Link href="/kursdaten-anmeldung">Jetzt Kurs auswählen</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
