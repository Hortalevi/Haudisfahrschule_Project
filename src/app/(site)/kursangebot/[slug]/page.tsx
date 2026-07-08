import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, Languages } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseIcon } from "@/components/ui/course-icon";
import { CourseCard } from "@/components/ui/course-card";
import { Reveal } from "@/components/ui/reveal";
import { getAllCourses, getCourseBySlug } from "@/lib/courses";
import { getDatesForCourse } from "@/lib/course-dates";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};

  return {
    title: `${course.title} – ${course.tagline}`,
    description: course.summary,
    alternates: { canonical: `/kursangebot/${course.slug}` },
    openGraph: {
      title: `${course.title} | Haudis Verkehrsschule`,
      description: course.summary,
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const [dates, allCourses, site] = await Promise.all([
    getDatesForCourse(course.slug),
    getAllCourses(),
    getSiteSettings(),
  ]);
  const otherCourses = allCourses.filter((c) => c.slug !== course.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.summary,
    provider: {
      "@type": "DrivingSchool",
      name: site.name,
      sameAs: site.url,
    },
    ...(course.priceFrom !== null && {
      offers: {
        "@type": "Offer",
        price: course.priceFrom,
        priceCurrency: "CHF",
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section tone="navy" className="pb-14 pt-14 sm:pt-16">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-white/50">
            <Link href="/kursangebot" className="hover:text-white">
              Kursangebot
            </Link>{" "}
            / <span className="text-white/80">{course.title}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-ember-400">
                <CourseIcon icon={course.icon} className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                {course.title}
              </h1>
              <p className="mt-3 text-lg text-ember-400">{course.tagline}</p>
            </div>

            {course.priceFrom !== null && (
              <Badge variant={course.priceFrom === 0 ? "moss" : "outline"} className="w-fit text-base">
                {course.priceFrom === 0 ? "Gratis" : `ab CHF ${course.priceFrom}`}
                {course.priceNote ? ` · ${course.priceNote}` : ""}
              </Badge>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/kursdaten-anmeldung">
                {course.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-light">
              <Link href="/kontakt">Frage stellen</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="max-w-2xl">
            {course.sections.map((section) => (
              <Reveal key={section.heading} className="mb-10 last:mb-0">
                <h2 className="font-display text-2xl font-bold text-navy-950">{section.heading}</h2>
                <div className="mt-3 space-y-4 leading-relaxed text-sand-700">
                  {section.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-navy-900/8 bg-white p-6 shadow-soft">
              <h3 className="font-display text-lg font-bold text-navy-950">Auf einen Blick</h3>
              <ul className="mt-4 space-y-3">
                {course.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-sm text-sand-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss-500" />
                    {highlight}
                  </li>
                ))}
              </ul>

              {course.duration && (
                <div className="mt-5 flex items-start gap-2.5 border-t border-navy-900/8 pt-5 text-sm text-sand-700">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                  {course.duration}
                </div>
              )}
              {course.languages && (
                <div className="mt-3 flex items-start gap-2.5 text-sm text-sand-700">
                  <Languages className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                  {course.languages.join(", ")}
                </div>
              )}

              <Button asChild size="md" className="mt-6 w-full">
                <Link href="/kursdaten-anmeldung">{course.ctaLabel}</Link>
              </Button>
            </div>

            {dates.length > 0 && (
              <div className="rounded-xl border border-navy-900/8 bg-white p-6 shadow-soft">
                <h3 className="font-display text-lg font-bold text-navy-950">Nächste Termine</h3>
                <ul className="mt-4 space-y-3">
                  {dates.slice(0, 3).map((d) => (
                    <li key={d.id} className="text-sm text-sand-700">
                      <span className="block font-semibold text-navy-900">{d.dateLabel}</span>
                      {d.timeSlots.join(" · ")}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/kursdaten-anmeldung"
                  className="focus-ring mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-800"
                >
                  Alle Termine &amp; Anmeldung
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <h2 className="font-display text-2xl font-bold text-navy-950">Das könnte dich auch interessieren</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherCourses.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
