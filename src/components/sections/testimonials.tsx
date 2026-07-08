"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import type { Testimonial } from "@/lib/testimonials";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Stimmen unserer Lernenden"
            title="Was unsere Fahrschüler:innen sagen"
          />
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-navy-900/15 text-navy-800 hover:bg-navy-900/5"
              aria-label="Vorherige Stimme"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-navy-900/15 text-navy-800 hover:bg-navy-900/5"
              aria-label="Nächste Stimme"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="w-[320px] shrink-0 snap-start sm:w-[360px]"
            >
              <div className="flex gap-0.5 text-ember-500">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-navy-900">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-5 border-t border-navy-900/8 pt-4">
                <p className="font-display font-bold text-navy-950">{testimonial.name}</p>
                <p className="text-sm text-sand-600">{testimonial.course}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
