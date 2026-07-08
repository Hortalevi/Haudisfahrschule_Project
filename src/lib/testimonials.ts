import "server-only";
import { apiGet } from "@/lib/api";

export type Testimonial = {
  name: string;
  course: string;
  rating: number;
  quote: string;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  return apiGet<Testimonial[]>("/public/testimonials");
}
