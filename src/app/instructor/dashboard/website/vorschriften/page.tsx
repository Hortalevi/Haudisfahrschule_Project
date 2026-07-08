import { apiGet } from "@/lib/api";
import { RegulationManager, type Regulation } from "./regulation-manager";

export const dynamic = "force-dynamic";

export default async function VorschriftenAdminPage() {
  const items = await apiGet<Regulation[]>("/public/regulations");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Vorschriften</h1>
      <p className="mt-1 text-sm text-sand-600">Fragen &amp; Antworten zu Auto- und Motorrad-Vorschriften.</p>
      <RegulationManager items={items} />
    </div>
  );
}
