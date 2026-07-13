import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow, Section } from "@/components/ui/section";
import { RegistrationFlow } from "@/components/sections/registration-flow";
import { getAllCourseDates } from "@/lib/course-dates";
import { getAllCourses } from "@/lib/courses";
import { getPublicInstructors } from "@/lib/users";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kursdaten & Anmeldung",
  description:
    "Aktuelle Kursdaten für VKU, BTU, Nothelferkurs, Motorradgrundkurs und Bögle in Baden – wähle deinen Termin und melde dich direkt online an.",
  alternates: { canonical: "/kursdaten-anmeldung" },
};

export default async function KursdatenAnmeldungPage() {
  const [dates, courses, instructors] = await Promise.all([
    getAllCourseDates(),
    getAllCourses(),
    getPublicInstructors(),
  ]);

  return (
    <>
      <Section tone="navy" className="pb-14 pt-16 sm:pt-20">
        <Container className="max-w-2xl">
          <Eyebrow tone="light">Kursdaten &amp; Anmeldung</Eyebrow>
          <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Wähle deinen Termin und melde dich an
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Alle aktuellen Kursdaten für VKU, BTU, Nothelferkurs, Motorradgrundkurs und Bögle –
            direkt online reservieren, wir bestätigen dir deinen Platz per E-Mail.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <RegistrationFlow dates={dates} courses={courses} instructors={instructors} />
        </Container>
      </Section>
    </>
  );
}
