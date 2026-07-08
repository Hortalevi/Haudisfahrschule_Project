"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { StatCounter } from "@/components/ui/stat-counter";
import { audienceOptions, type Audience } from "@/content/courses";

const audienceTargets: Record<Audience, string> = {
  auto: "/kursangebot/fahrstunden-auto",
  motorrad: "/kursangebot/motorradgrundkurs",
  nothelfer: "/kursangebot/nothelferkurs",
  "vku-btu": "/kursangebot/vku",
  boegle: "/kursangebot/boegle",
};

export function Hero() {
  const router = useRouter();
  const [selected, setSelected] = useState<Audience | null>(null);

  const handleSelect = (value: string) => {
    const audience = value as Audience;
    setSelected(audience);
    router.push(audienceTargets[audience]);
  };

  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-16 text-white sm:pb-28 sm:pt-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,122,69,0.25), transparent 40%), radial-gradient(circle at 85% 0%, rgba(45,95,158,0.35), transparent 45%)",
        }}
        aria-hidden
      />
      <svg
        className="pointer-events-none absolute -right-24 top-10 hidden h-[420px] w-[420px] opacity-[0.08] lg:block"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
      >
        <circle cx="100" cy="100" r="99" stroke="white" strokeWidth="1.5" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="14" fill="white" />
      </svg>

      <Container className="relative">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80">
            Das grösste &amp; modernste Verkehrszentrum der Region · Baden AG
          </span>
          <h1 className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Dein Weg zum Führerausweis beginnt hier.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Fahrstunden, VKU, BTU, Nothelferkurs und Motorradausbildung – individuell begleitet
            von Bruno &amp; Ausilia Haudenschild, mehrsprachig, in Badens grösstem eigenen
            Verkehrszentrum.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/kursdaten-anmeldung">
                Fahrstunde buchen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-light">
              <Link href="/kursdaten-anmeldung">
                <CalendarCheck2 className="h-4 w-4" />
                Kursdaten ansehen
              </Link>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <div>
              <dd className="font-display text-3xl font-bold">
                <StatCounter value={20} suffix="+" />
              </dd>
              <dt className="mt-1 text-xs text-white/60">Jahre Erfahrung</dt>
            </div>
            <div>
              <dd className="font-display text-3xl font-bold">
                <StatCounter value={2500} suffix="+" />
              </dd>
              <dt className="mt-1 text-xs text-white/60">Ausgebildete Lernende</dt>
            </div>
            <div>
              <dd className="font-display text-3xl font-bold">
                <StatCounter value={5} />
              </dd>
              <dt className="mt-1 text-xs text-white/60">Unterrichtssprachen</dt>
            </div>
          </dl>
        </div>

        <div
          className="mt-14 animate-fade-up rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8"
          style={{ animationDelay: "0.15s" }}
        >
          <h2 className="font-display text-lg font-bold">Was suchst du?</h2>
          <p className="mt-1 text-sm text-white/60">
            Wähle deinen Bereich – wir zeigen dir direkt das passende Angebot.
          </p>
          <SegmentedControl
            className="mt-5"
            options={audienceOptions}
            value={selected ?? ""}
            onValueChange={handleSelect}
          />
        </div>
      </Container>
    </section>
  );
}
