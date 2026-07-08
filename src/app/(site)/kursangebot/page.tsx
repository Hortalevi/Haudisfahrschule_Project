import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { CourseCard } from "@/components/ui/course-card";
import { Reveal } from "@/components/ui/reveal";
import { CTABanner } from "@/components/sections/cta-banner";
import type { Course } from "@/content/courses";
import { getAllCourses } from "@/lib/courses";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kursangebot – Fahrstunden, VKU, BTU, Nothelferkurs & mehr",
  description:
    "Das komplette Kursangebot von Haudis Verkehrsschule in Baden: Fahrstunden Auto & Motorrad, VKU, BTU, Nothelferkurs, Bögle, Motorradgrundkurs, Lastwagen und Taxi.",
  alternates: { canonical: "/kursangebot" },
};

const groups: { key: Course["category"]; title: string; description: string }[] = [
  {
    key: "pflicht",
    title: "Pflichtkurse",
    description: "Diese Kurse benötigst du für jedes Führerausweis-Gesuch der Kategorie B.",
  },
  {
    key: "auto",
    title: "Auto",
    description: "Praktische Fahrausbildung für den Führerausweis Kategorie B.",
  },
  {
    key: "motorrad",
    title: "Motorrad",
    description: "Grundausbildung und Fahrstunden für die Kategorien A1, A beschränkt und A.",
  },
  {
    key: "zusatz",
    title: "Zusatzangebote",
    description: "Gratis Prüfungsvorbereitung sowie Ausbildung für Lastwagen und Taxi.",
  },
];

export default async function KursangebotPage() {
  const courses = await getAllCourses();

  return (
    <>
      <Section tone="navy" className="pb-16 pt-16 sm:pt-20">
        <Container className="max-w-3xl text-center">
          <Eyebrow tone="light">Kursangebot</Eyebrow>
          <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Alles für deinen Führerausweis – an einem Ort
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            Vom Nothelferkurs über VKU und BTU bis zu Fahrstunden und Prüfungsvorbereitung:
            wähle deinen Kurs und starte durch.
          </p>
        </Container>
      </Section>

      {groups.map((group, groupIndex) => {
        const groupCourses = courses.filter((c) => c.category === group.key);
        if (groupCourses.length === 0) return null;
        return (
          <Section key={group.key} tone={groupIndex % 2 === 1 ? "sand" : "light"}>
            <Container>
              <SectionHeading eyebrow={group.title} title={group.description} />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {groupCourses.map((course, i) => (
                  <Reveal key={course.slug} delay={(i % 3) * 0.06}>
                    <CourseCard course={course} />
                  </Reveal>
                ))}
              </div>
            </Container>
          </Section>
        );
      })}

      <CTABanner />
    </>
  );
}
