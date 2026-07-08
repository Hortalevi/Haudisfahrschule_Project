import { notFound } from "next/navigation";
import { getCourseRowBySlug } from "@/lib/courses";
import { listToText, sectionsToText } from "@/lib/course-content-format";
import { CourseForm } from "../course-form";
import { updateCourse } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseRowBySlug(slug);
  if (!course) notFound();

  const boundUpdate = updateCourse.bind(null, course.slug);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-navy-950">Angebot bearbeiten</h1>
      <p className="mt-1 text-sm text-sand-600">{course.title}</p>

      <CourseForm
        action={boundUpdate}
        submitLabel="Änderungen speichern"
        lockSlug
        initial={{
          slug: course.slug,
          title: course.title,
          tagline: course.tagline,
          icon: course.icon,
          category: course.category,
          audience: course.audience,
          priceFrom: course.priceFrom,
          priceUnit: course.priceUnit,
          priceNote: course.priceNote ?? "",
          summary: course.summary,
          highlightsText: listToText(course.highlights),
          languagesText: listToText(course.languages),
          duration: course.duration ?? "",
          ctaLabel: course.ctaLabel,
          sectionsText: sectionsToText(course.sections),
          costPerSession: course.costPerSession,
          active: course.active,
        }}
      />
    </div>
  );
}
