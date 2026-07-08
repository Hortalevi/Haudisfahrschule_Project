import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function EinstellungenPage() {
  const site = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Einstellungen</h1>
      <p className="mt-1 text-sm text-sand-600">Kontaktdaten, Adresse, Öffnungszeiten und Beschreibung der Website.</p>
      <SettingsForm initial={site} />
    </div>
  );
}
