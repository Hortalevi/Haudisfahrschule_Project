"use server";

import { revalidatePath } from "next/cache";
import { apiMutate, ApiError } from "@/lib/api";
import { textToList } from "@/lib/course-content-format";

export type SiteSettingsActionState = { error?: string; success?: boolean } | undefined;

export async function updateSiteSettings(
  _state: SiteSettingsActionState,
  formData: FormData,
): Promise<SiteSettingsActionState> {
  const openingHoursText = String(formData.get("openingHoursText") ?? "");
  const openingHours = textToList(openingHoursText).map((line) => {
    const [days, ...rest] = line.split(":");
    return { days: days.trim(), hours: rest.join(":").trim() };
  });

  const socialsText = String(formData.get("socialsText") ?? "");
  const socials = textToList(socialsText).map((line) => {
    const [label, href] = line.split("|");
    return { label: label?.trim() ?? "", href: href?.trim() ?? "" };
  });

  const request = {
    name: String(formData.get("name") ?? "").trim(),
    legalName: String(formData.get("legalName") ?? "").trim(),
    shortName: String(formData.get("shortName") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    phoneDisplay: String(formData.get("phoneDisplay") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    addressStreet: String(formData.get("addressStreet") ?? "").trim(),
    addressPostalCode: String(formData.get("addressPostalCode") ?? "").trim(),
    addressCity: String(formData.get("addressCity") ?? "").trim(),
    addressRegion: String(formData.get("addressRegion") ?? "").trim(),
    addressCountry: String(formData.get("addressCountry") ?? "").trim(),
    geoLatitude: formData.get("geoLatitude") ? Number(formData.get("geoLatitude")) : null,
    geoLongitude: formData.get("geoLongitude") ? Number(formData.get("geoLongitude")) : null,
    founders: textToList(String(formData.get("foundersText") ?? "")),
    openingHours,
    socials,
  };

  try {
    await apiMutate("/content/site-settings", "PUT", request);
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }

  revalidatePath("/", "layout");
  return { success: true };
}
