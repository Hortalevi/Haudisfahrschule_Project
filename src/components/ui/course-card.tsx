import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/content/courses";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseIcon } from "@/components/ui/course-icon";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group flex h-full flex-col hover:-translate-y-1 hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-900/5 text-navy-800 transition-colors duration-300 group-hover:bg-ember-700 group-hover:text-white">
          <CourseIcon icon={course.icon} />
        </div>
        {course.priceFrom !== null && (
          <Badge variant={course.priceFrom === 0 ? "moss" : "ember"}>
            {course.priceFrom === 0 ? "Gratis" : `ab CHF ${course.priceFrom}`}
          </Badge>
        )}
      </div>

      <h3 className="mt-5 font-display text-xl font-bold text-navy-950">{course.title}</h3>
      <p className="mt-1 text-sm font-medium text-ember-800">{course.tagline}</p>
      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-sand-600">{course.summary}</p>

      <Link
        href={`/kursangebot/${course.slug}`}
        className="focus-ring mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 transition-colors group-hover:text-ember-800"
      >
        Mehr erfahren
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Card>
  );
}
