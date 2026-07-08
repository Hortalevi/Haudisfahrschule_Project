// Site-wide contact/settings info, FAQ, testimonials, gallery, regulations,
// and "Der Weg" steps are all admin-editable now (see src/lib/site-settings.ts,
// faq.ts, testimonials.ts, gallery.ts, regulations.ts, process-steps.ts).
// What's left here is structural navigation, which stays static/code-defined.

export const serviceAreas = [
  "Baden",
  "Ennetbaden",
  "Untersiggenthal",
  "Turgi",
  "Nussbaumen",
  "Brugg",
  "Dättwil",
  "Veltheim",
] as const;

export type NavChild = { label: string; href: string; description?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Der Weg", href: "/der-weg" },
  {
    label: "Kursangebot",
    href: "/kursangebot",
    children: [
      { label: "Fahrstunden Auto", href: "/kursangebot/fahrstunden-auto" },
      { label: "Fahrstunden Motorrad", href: "/kursangebot/fahrstunden-motorrad" },
      { label: "Motorradgrundkurs", href: "/kursangebot/motorradgrundkurs" },
      { label: "VKU", href: "/kursangebot/vku", description: "Verkehrskunde-Unterricht" },
      { label: "BTU", href: "/kursangebot/btu", description: "Basis-Theorie-Unterricht" },
      { label: "Nothelferkurs", href: "/kursangebot/nothelferkurs" },
      { label: "Bögle", href: "/kursangebot/boegle", description: "Gratis Prüfungsfragebogen-Übung" },
      { label: "Lastwagen", href: "/kursangebot/lastwagen" },
      { label: "Taxi", href: "/kursangebot/taxi" },
    ],
  },
  { label: "Kursdaten & Anmeldung", href: "/kursdaten-anmeldung" },
  {
    label: "Vorschriften",
    href: "/vorschriften/auto",
    children: [
      { label: "Vorschriften Auto", href: "/vorschriften/auto" },
      { label: "Vorschriften Motorrad", href: "/vorschriften/motorrad" },
    ],
  },
  { label: "Galerie", href: "/galerie" },
  { label: "Standort", href: "/standort" },
  { label: "Kontakt", href: "/kontakt" },
];

export const footerCourseLinks: NavChild[] = [
  { label: "Fahrstunden Auto", href: "/kursangebot/fahrstunden-auto" },
  { label: "Fahrstunden Motorrad", href: "/kursangebot/fahrstunden-motorrad" },
  { label: "Motorradgrundkurs", href: "/kursangebot/motorradgrundkurs" },
  { label: "VKU", href: "/kursangebot/vku" },
  { label: "BTU", href: "/kursangebot/btu" },
  { label: "Nothelferkurs", href: "/kursangebot/nothelferkurs" },
  { label: "Bögle", href: "/kursangebot/boegle" },
  { label: "Lastwagen", href: "/kursangebot/lastwagen" },
  { label: "Taxi", href: "/kursangebot/taxi" },
];
