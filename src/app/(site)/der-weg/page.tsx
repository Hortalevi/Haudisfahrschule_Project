import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow, Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CTABanner } from "@/components/sections/cta-banner";
import { getProcessSteps } from "@/lib/process-steps";

export const metadata: Metadata = {
  title: "Der Weg zum Führerausweis",
  description:
    "So läuft der Weg zum Führerausweis in der Schweiz ab: vom Nothelferkurs über die Theorieprüfung bis zur praktischen Prüfung – Schritt für Schritt erklärt.",
  alternates: { canonical: "/der-weg" },
};

export default async function DerWegPage() {
  const derWegSteps = await getProcessSteps();

  return (
    <>
      <Section tone="navy" className="pb-14 pt-16 sm:pt-20">
        <Container className="max-w-2xl">
          <Eyebrow tone="light">Der Weg</Eyebrow>
          <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Dein Weg zum Führerausweis – Schritt für Schritt
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Von der ersten Anmeldung bis zur bestandenen Prüfung: so läuft der Prozess in der
            Schweiz ab, und so begleiten wir dich dabei.
          </p>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <ol className="space-y-10">
            {derWegSteps.map((step, i) => (
              <Reveal key={step.step} as="li" delay={i * 0.06} className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-950 font-display text-lg font-bold text-white">
                  {step.step}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-navy-950">{step.title}</h2>
                  <p className="mt-2 leading-relaxed text-sand-700">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-14 flex justify-center">
            <Button asChild size="lg">
              <Link href="/kursangebot">
                Passenden Kurs finden
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      <CTABanner />
    </>
  );
}
