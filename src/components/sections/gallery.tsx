"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/gallery";

const filters: { value: string; label: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "fahrzeuge", label: "Fahrzeuge" },
  { value: "verkehrszentrum", label: "Verkehrszentrum" },
];

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("alle");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "alle" ? images : images.filter((img) => img.category === filter)),
    [filter, images],
  );

  const active = activeIndex !== null ? filtered[activeIndex] : null;

  const show = (delta: number) => {
    if (activeIndex === null) return;
    const next = (activeIndex + delta + filtered.length) % filtered.length;
    setActiveIndex(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              filter === f.value
                ? "border-navy-950 bg-navy-950 text-white"
                : "border-navy-900/15 text-navy-800 hover:bg-navy-900/5",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="focus-ring group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-navy-950/0 opacity-0 transition-all duration-300 group-hover:bg-navy-950/30 group-hover:opacity-100">
              <Expand className="h-6 w-6 text-white" />
            </span>
          </button>
        ))}
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-3xl bg-navy-950 p-2 sm:p-3">
          <DialogTitle className="sr-only">{active?.alt ?? "Galeriebild"}</DialogTitle>
          {active && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          )}
          <div className="mt-2 flex items-center justify-between px-2 pb-1">
            <button
              type="button"
              onClick={() => show(-1)}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="max-w-md text-center text-sm text-white/70">{active?.alt}</p>
            <button
              type="button"
              onClick={() => show(1)}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
