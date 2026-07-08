import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { getAllCourses } from "@/lib/courses";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteSettings();
  const staticRoutes = [
    "",
    "/der-weg",
    "/kursangebot",
    "/kursdaten-anmeldung",
    "/vorschriften/auto",
    "/vorschriften/motorrad",
    "/galerie",
    "/kontakt",
  ];

  const courses = await getAllCourses();
  const courseRoutes = courses.map((course) => `/kursangebot/${course.slug}`);

  const now = new Date();

  return [...staticRoutes, ...courseRoutes].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/kursangebot") ? 0.8 : 0.6,
  }));
}
