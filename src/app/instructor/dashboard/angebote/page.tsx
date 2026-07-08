import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllCoursesForDashboard } from "@/lib/courses";
import { CourseRowActions } from "./course-row-actions";

export const dynamic = "force-dynamic";

export default async function AngebotePage() {
  const courses = await getAllCoursesForDashboard();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">Angebote</h1>
          <p className="mt-1 text-sm text-sand-600">Verwalte Kursangebote, Preise und Inhalte.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/instructor/dashboard/angebote/neu">
            <Plus className="h-4 w-4" />
            Neues Angebot
          </Link>
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {courses.map((course) => (
          <Card key={course.slug} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-navy-950">{course.title}</h2>
                {!course.active && <Badge variant="navy">Inaktiv</Badge>}
              </div>
              <p className="mt-1 text-sm text-sand-600">{course.tagline}</p>
              <p className="mt-1 text-xs text-sand-500">
                {course.priceFrom !== null ? `ab CHF ${course.priceFrom} · ${course.priceUnit}` : course.priceUnit}
                {" · Kosten pro Termin: CHF "}
                {course.costPerSession}
              </p>
            </div>
            <CourseRowActions slug={course.slug} active={course.active} />
          </Card>
        ))}
      </div>
    </div>
  );
}
