import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { getGalleryImages } from "@/lib/gallery";

export async function GalleryPreview() {
  const preview = (await getGalleryImages()).slice(0, 6);

  return (
    <Section tone="sand">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Einblicke"
            title="Unser Verkehrszentrum & unsere Fahrzeuge"
            description="Ein Blick hinter die Kulissen – unser Schulungszentrum und unsere Flotte in Baden."
          />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {preview.map((image, i) => (
            <Reveal key={image.src} delay={i * 0.05} className="group relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/galerie">
              Ganze Galerie ansehen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
