import { apiGet } from "@/lib/api";
import { ProcessStepManager, type ProcessStep } from "./process-step-manager";

export const dynamic = "force-dynamic";

export default async function DerWegAdminPage() {
  const items = await apiGet<ProcessStep[]>("/public/process-steps");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Der Weg</h1>
      <p className="mt-1 text-sm text-sand-600">Schritte auf dem Weg zum Führerausweis.</p>
      <ProcessStepManager items={items} />
    </div>
  );
}
