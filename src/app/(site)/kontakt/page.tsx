import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow, Section } from "@/components/ui/section";
import { ContactForm } from "@/components/sections/contact-form";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktiere Haudis Verkehrsschule in Baden: Adresse, Telefon, E-Mail und Öffnungszeiten des Verkehrszentrums.",
  alternates: { canonical: "/kontakt" },
};

export default async function KontaktPage() {
  const site = await getSiteSettings();
  const mapQuery = encodeURIComponent(`${site.addressStreet}, ${site.addressPostalCode} ${site.addressCity}`);

  return (
    <>
      <Section tone="navy" className="pb-14 pt-16 sm:pt-20">
        <Container className="max-w-2xl">
          <Eyebrow tone="light">Kontakt</Eyebrow>
          <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Wir freuen uns auf dich
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Fragen zu Kursen, Terminen oder deiner Anmeldung? Ruf uns an, schreib uns eine
            Nachricht oder komm im Verkehrszentrum vorbei.
          </p>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-ember-600" />
                <div>
                  <p className="font-display font-bold text-navy-950">Verkehrszentrum Baden</p>
                  <p className="text-sand-700">
                    {site.addressStreet}, {site.addressPostalCode} {site.addressCity}
                  </p>
                  <p className="text-sm text-sand-600">
                    Ca. 350 m vom Bahnhof Baden entfernt.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-ember-600" />
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="focus-ring text-sand-700 hover:text-navy-950">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-ember-600" />
                <a href={`mailto:${site.email}`} className="focus-ring text-sand-700 hover:text-navy-950">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-ember-600" />
                <div className="text-sand-700">
                  {site.openingHours.map((h) => (
                    <p key={h.days}>
                      <span className="font-semibold text-navy-900">{h.days}:</span> {h.hours}
                    </p>
                  ))}
                </div>
              </li>
            </ul>

            <div className="mt-8 overflow-hidden rounded-xl border-2 border-yellow-400 shadow-soft">
              <iframe
                title="Standort Haudis Verkehrsschule auf Google Maps"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-80 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <Link
              href="/standort"
              className="focus-ring mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-800 hover:underline"
            >
              Grössere Karte &amp; Anfahrt ansehen
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ContactForm />
        </Container>
      </Section>
    </>
  );
}
