import "server-only";
import { apiGet } from "@/lib/api";

export type GalleryImage = {
  src: string;
  alt: string;
  category: string;
};

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return apiGet<GalleryImage[]>("/public/gallery");
}
