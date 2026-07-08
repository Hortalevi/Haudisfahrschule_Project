import { apiGet } from "@/lib/api";
import { FaqManager, type FaqItem } from "./faq-manager";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  const items = await apiGet<FaqItem[]>("/public/faq");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">FAQ</h1>
      <p className="mt-1 text-sm text-sand-600">Häufige Fragen auf der Startseite.</p>
      <FaqManager items={items} />
    </div>
  );
}
