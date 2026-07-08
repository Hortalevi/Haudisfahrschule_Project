// Course content itself is admin-editable and DB-backed now (see src/lib/courses.ts).
// What's left here are the shared type and the static audience-filter labels
// used by the Hero search widget (tied to the fixed Audience union, not
// something admins need to customize independently of course content).

export type Audience = "auto" | "motorrad" | "nothelfer" | "vku-btu" | "boegle";

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  icon: "steering-wheel" | "bike" | "heart-pulse" | "book-open" | "clipboard-check" | "truck" | "car-taxi";
  category: "pflicht" | "auto" | "motorrad" | "zusatz";
  audience: Audience;
  priceFrom: number | null;
  priceUnit: string;
  priceNote?: string;
  summary: string;
  highlights: string[];
  languages?: string[];
  duration?: string;
  ctaLabel: string;
  sections: { heading: string; body: string[] }[];
};

export const audienceOptions: { id: Audience; label: string; description: string }[] = [
  { id: "auto", label: "Auto", description: "Fahrstunden & praktische Prüfung" },
  { id: "motorrad", label: "Motorrad", description: "Grundkurs & Fahrstunden" },
  { id: "nothelfer", label: "Nothelfer", description: "Pflichtkurs für jedes Gesuch" },
  { id: "vku-btu", label: "VKU / BTU", description: "Theoriekurse vor der Prüfung" },
  { id: "boegle", label: "Bögle", description: "Gratis Prüfungsfragebogen" },
];
