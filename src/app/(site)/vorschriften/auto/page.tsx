import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getAutoRegulations } from "@/lib/regulations";

export const metadata: Metadata = {
  title: "Vorschriften Auto – Führerausweis Kategorie B",
  description:
    "Aktuelle Vorschriften für den Führerausweis Kategorie B in der Schweiz seit der Reform OPERA-3: Theorieprüfung, praktische Prüfung, Führerausweis auf Probe.",
  alternates: { canonical: "/vorschriften/auto" },
};

export default async function VorschriftenAutoPage() {
  const autoRegulations = await getAutoRegulations();

  return (
    <>
      <Section tone="navy" className="pb-14 pt-16 sm:pt-20">
        <Container className="max-w-2xl">
          <div className="flex gap-2 text-sm text-white/50">
            <span>Vorschriften</span>
            <span>/</span>
            <span className="text-white/80">Auto</span>
            <span className="ml-2">·</span>
            <Link href="/vorschriften/motorrad" className="text-ember-400 hover:underline">
              Motorrad ansehen
            </Link>
          </div>
          <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Vorschriften Auto (Kategorie B)
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Die wichtigsten Regeln rund um den Führerausweis Kategorie B, seit der Reform
            OPERA-3 (in Kraft seit 1. Januar 2021).
          </p>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-navy-950">
            Fragen &amp; Antworten
          </h2>
          <Accordion type="single" collapsible className="mt-6">
            {autoRegulations.map((item, i) => (
              <AccordionItem key={item.question} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {item.answer.map((paragraph, j) => (
                      <p key={j}>{paragraph}</p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-10 text-sm text-sand-600">
            Diese Übersicht ersetzt keine Rechtsberatung. Bei Fragen zu deiner persönlichen
            Situation kontaktiere uns direkt – wir helfen dir gerne weiter.
          </p>
        </Container>
      </Section>
    </>
  );
}
