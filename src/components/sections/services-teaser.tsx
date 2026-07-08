import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { CourseCard } from "@/components/ui/course-card";
import { Reveal } from "@/components/ui/reveal";
import { getAllCourses } from "@/lib/courses";

const featuredSlugs = [
  "fahrstunden-auto",
  "fahrstunden-motorrad",
  "motorradgrundkurs",
  "vku",
  "btu",
  "nothelferkurs",
  "boegle",
];

export async function ServicesTeaser() {
  const courses = await getAllCourses();
  const featured = featuredSlugs
    .map((slug) => courses.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <Section id="kursangebot" tone="sand">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Kursangebot"
            title="Alles für deinen Führerausweis – an einem Ort"
            description="Vom Nothelferkurs bis zur praktischen Prüfung: bei uns findest du jeden Schritt auf dem Weg zum Billett."
          />
          <Link
            href="/kursangebot"
            className="focus-ring hidden shrink-0 items-center gap-1.5 font-semibold text-navy-900 hover:text-ember-800 sm:flex"
          >
            Alle Kurse ansehen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((course, i) => (
            <Reveal key={course.slug} delay={(i % 4) * 0.06}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/kursangebot"
            className="focus-ring inline-flex items-center gap-1.5 font-semibold text-navy-900"
          >
            Alle Kurse ansehen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
