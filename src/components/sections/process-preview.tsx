import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { getProcessSteps } from "@/lib/process-steps";

export async function ProcessPreview() {
  const steps = await getProcessSteps();

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Der Weg"
          title="Vom Lernfahrausweis zum Billett – Schritt für Schritt"
          description="Wir begleiten dich durch den gesamten Prozess, damit du jederzeit weisst, was als Nächstes kommt."
          align="center"
          className="mx-auto"
        />

        <div className="relative mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">

          {steps.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-950 font-display text-lg font-bold text-white">
                {step.step}
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sand-600">{step.description}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/der-weg">
              Der ganze Weg im Detail
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
