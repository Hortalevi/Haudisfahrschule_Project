import { apiGet } from "@/lib/api";
import { GalleryManager, type GalleryImage } from "./gallery-manager";

export const dynamic = "force-dynamic";

export default async function GalerieAdminPage() {
  const items = await apiGet<GalleryImage[]>("/public/gallery");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Galerie</h1>
      <p className="mt-1 text-sm text-sand-600">
        Bilder von Fahrzeugen und Verkehrszentrum. Pfad muss auf ein vorhandenes Bild in{" "}
        <code>/public</code> oder eine externe Bild-URL zeigen.
      </p>
      <GalleryManager items={items} />
    </div>
  );
}
