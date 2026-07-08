import "server-only";
import { cache } from "react";
import { apiGet } from "@/lib/api";

export type SiteSettings = {
  name: string;
  legalName: string;
  shortName: string;
  url: string;
  description: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  addressStreet: string;
  addressPostalCode: string;
  addressCity: string;
  addressRegion: string;
  addressCountry: string;
  geoLatitude: number | null;
  geoLongitude: number | null;
  founders: string[];
  openingHours: { days: string; hours: string }[];
  socials: { label: string; href: string }[];
  updatedAt: string;
};

// Deduped per-request (see src/lib/dal.ts for the same React cache() pattern) -
// several places in a single render (metadata, layout, robots, sitemap) all
// need this without triggering separate fetches each time.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return apiGet<SiteSettings>("/public/site-settings");
});
