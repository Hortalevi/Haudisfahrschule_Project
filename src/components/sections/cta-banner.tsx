import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getSiteSettings } from "@/lib/site-settings";

export async function CTABanner() {
  const site = await getSiteSettings();

  return (
    <section className="bg-navy-950 py-20">
      <Container>
        <Reveal className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ember-700 to-ember-800 px-8 py-14 text-center sm:px-16">
          <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Bereit für deine erste Fahrstunde?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Wähle deinen Kurs, sichere dir ein Datum und leg los – oder ruf uns einfach an,
            wir beraten dich persönlich.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="/kursdaten-anmeldung">
                Kurs auswählen &amp; anmelden
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-light">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                <Phone className="h-4 w-4" />
                {site.phoneDisplay}
              </a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
