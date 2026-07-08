import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { serviceAreas } from "@/content/site";

export function ServiceAreas() {
  return (
    <section className="border-y-[3px] border-yellow-400 bg-white py-10">
      <Container className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="flex items-center gap-2 font-display font-semibold text-navy-900">
          <MapPin className="h-5 w-5 text-ember-600" />
          Auch für Lernende aus der Umgebung von Baden:
        </p>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm text-sand-600">
          {serviceAreas
            .filter((area) => area !== "Baden")
            .map((area) => (
              <li key={area}>{area}</li>
            ))}
        </ul>
        <Link
          href="/standort"
          className="focus-ring flex shrink-0 items-center gap-1.5 rounded-full bg-navy-950 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
        >
          Standort ansehen
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Container>
    </section>
  );
}
