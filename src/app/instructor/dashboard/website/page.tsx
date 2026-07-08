import Link from "next/link";
import { Settings, HelpCircle, Star, Images, Scale, Milestone } from "lucide-react";
import { Card } from "@/components/ui/card";

const sections = [
  {
    href: "/instructor/dashboard/website/einstellungen",
    label: "Einstellungen",
    description: "Kontaktdaten, Adresse, Öffnungszeiten und Beschreibung der Website.",
    icon: Settings,
  },
  {
    href: "/instructor/dashboard/website/faq",
    label: "FAQ",
    description: "Häufige Fragen auf der Startseite.",
    icon: HelpCircle,
  },
  {
    href: "/instructor/dashboard/website/bewertungen",
    label: "Bewertungen",
    description: "Stimmen von Fahrschüler:innen auf der Startseite.",
    icon: Star,
  },
  {
    href: "/instructor/dashboard/website/galerie",
    label: "Galerie",
    description: "Bilder von Fahrzeugen und Verkehrszentrum.",
    icon: Images,
  },
  {
    href: "/instructor/dashboard/website/vorschriften",
    label: "Vorschriften",
    description: "Fragen & Antworten zu Auto- und Motorrad-Vorschriften.",
    icon: Scale,
  },
  {
    href: "/instructor/dashboard/website/der-weg",
    label: "Der Weg",
    description: "Schritte auf dem Weg zum Führerausweis.",
    icon: Milestone,
  },
];

export default function WebsitePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Website</h1>
      <p className="mt-1 text-sm text-sand-600">
        Inhalte der öffentlichen Website bearbeiten – Änderungen sind sofort sichtbar.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="focus-ring block rounded-xl">
            <Card className="h-full transition-colors hover:border-ember-500/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ember-500/10 text-ember-800">
                <section.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-3 font-display font-bold text-navy-950">{section.label}</h2>
              <p className="mt-1 text-sm text-sand-600">{section.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
