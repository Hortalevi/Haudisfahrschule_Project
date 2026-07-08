import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow, Section } from "@/components/ui/section";
import { Gallery } from "@/components/sections/gallery";
import { CTABanner } from "@/components/sections/cta-banner";
import { getGalleryImages } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Einblicke in das Verkehrszentrum und die Fahrzeugflotte von Haudis Verkehrsschule in Baden.",
  alternates: { canonical: "/galerie" },
};

export default async function GaleriePage() {
  const images = await getGalleryImages();

  return (
    <>
      <Section tone="navy" className="pb-14 pt-16 sm:pt-20">
        <Container className="max-w-2xl">
          <Eyebrow tone="light">Galerie</Eyebrow>
          <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Unser Verkehrszentrum &amp; unsere Flotte
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Ein Blick hinter die Kulissen – auf ein professionelles Fotoshooting mit aktuellen
            Fahrzeugen folgt hier demnächst ein Update.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <Gallery images={images} />
        </Container>
      </Section>

      <CTABanner />
    </>
  );
}
