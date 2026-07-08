import { Building2, Languages, HeartHandshake, GraduationCap } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const points = [
  {
    icon: Building2,
    title: "Eigenes Verkehrszentrum",
    description:
      "Das grösste und modernste Verkehrszentrum der Region – nur 350 m vom Bahnhof Baden entfernt, mit modernster Ausstattung für Theorie und Praxis.",
  },
  {
    icon: HeartHandshake,
    title: "Individuelle Betreuung",
    description:
      "Wir nehmen uns Zeit für dich – dein Lerntempo, deine Anliegen und deine Ziele stehen im Zentrum jeder Lektion.",
  },
  {
    icon: Languages,
    title: "Mehrsprachiger Unterricht",
    description:
      "Fahrstunden und Theoriekurse auf Deutsch, Italienisch, Spanisch, Französisch und Englisch – lerne in der Sprache, in der du dich am sichersten fühlst.",
  },
  {
    icon: GraduationCap,
    title: "Alles aus einer Hand",
    description:
      "Nothelferkurs, VKU, BTU, Fahrstunden und Prüfungsvorbereitung – von Anfang bis Billett begleiten wir dich lückenlos.",
  },
];

export function WhyUs() {
  return (
    <Section tone="navy">
      <Container>
        <SectionHeading
          eyebrow="Warum Haudi's"
          title="Ausbildung, der Familien in Baden seit Jahren vertrauen"
          tone="light"
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.08}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-ember-400">
                <point.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{point.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
