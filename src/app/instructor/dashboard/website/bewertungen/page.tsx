import { apiGet } from "@/lib/api";
import { TestimonialManager, type Testimonial } from "./testimonial-manager";

export const dynamic = "force-dynamic";

export default async function BewertungenAdminPage() {
  const items = await apiGet<Testimonial[]>("/public/testimonials");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Bewertungen</h1>
      <p className="mt-1 text-sm text-sand-600">Stimmen von Fahrschüler:innen auf der Startseite.</p>
      <TestimonialManager items={items} />
    </div>
  );
}
