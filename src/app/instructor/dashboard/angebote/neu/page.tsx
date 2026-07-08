import { CourseForm } from "../course-form";
import { createCourse } from "../actions";

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-navy-950">Neues Angebot</h1>
      <p className="mt-1 text-sm text-sand-600">Erstelle einen neuen Kurs für die Website.</p>

      <CourseForm
        action={createCourse}
        submitLabel="Angebot erstellen"
        initial={{
          slug: "",
          title: "",
          tagline: "",
          icon: "book-open",
          category: "zusatz",
          audience: "auto",
          priceFrom: null,
          priceUnit: "",
          priceNote: "",
          summary: "",
          highlightsText: "",
          languagesText: "",
          duration: "",
          ctaLabel: "Jetzt anfragen",
          sectionsText: "## Überschrift\nErster Absatz.",
          costPerSession: 0,
          active: true,
        }}
      />
    </div>
  );
}
