import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export function AboutTeaser() {
  return (
    <Section>
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src="/images/gallery/t6.jpg"
            alt="Fahrlehrer Bruno Haudenschild erklärt eine Verkehrssituation im Schulungsraum des Verkehrszentrums"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <span className="font-display text-sm font-semibold uppercase tracking-wider text-ember-800">
            Über uns
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            Familiengeführt, mit Herzblut für sicheres Fahren
          </h2>
          <p className="mt-5 leading-relaxed text-sand-700">
            Bruno und Ausilia Haudenschild führen Haudis Verkehrsschule mit einem klaren
            Ziel: jede und jeden Lernenden ernst nehmen, individuell fördern und mit Freude
            an eine sichere Fahrpraxis heranführen. Aus dieser Haltung heraus haben wir das
            grösste und modernste Verkehrszentrum der Region aufgebaut – für einen
            Unterricht, der seriös und zugleich angenehm ist.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/kontakt">
              Lerne uns kennen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
