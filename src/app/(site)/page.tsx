import { Hero } from "@/components/sections/hero";
import { ServicesTeaser } from "@/components/sections/services-teaser";
import { ProcessPreview } from "@/components/sections/process-preview";
import { WhyUs } from "@/components/sections/why-us";
import { ServiceAreas } from "@/components/sections/service-areas";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { FAQ } from "@/components/sections/faq";
import { CTABanner } from "@/components/sections/cta-banner";
import { getTestimonials } from "@/lib/testimonials";

export const dynamic = "force-dynamic";

export default async function Home() {
  const testimonials = await getTestimonials();

  return (
    <>
      <Hero />
      <ServicesTeaser />
      <ProcessPreview />
      <WhyUs />
      <ServiceAreas />
      <AboutTeaser />
      <GalleryPreview />
      <Testimonials testimonials={testimonials} />
      <FAQ />
      <CTABanner />
    </>
  );
}
