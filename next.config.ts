import type { NextConfig } from "next";

const JAVA_API_URL = process.env.JAVA_API_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Proxies browser-side calls to the Java backend through the same origin, so
  // its httpOnly session cookie and XSRF-TOKEN cookie behave as first-party
  // cookies (no CORS, no cross-site cookie issues). Server Components/Actions
  // call JAVA_API_URL directly instead (see src/lib/api.ts).
  async rewrites() {
    return [{ source: "/api/backend/:path*", destination: `${JAVA_API_URL}/api/:path*` }];
  },
  async redirects() {
    return [
      // Legacy ASP site URLs -> new routes, preserves inbound links & SEO equity.
      { source: "/default.asp", destination: "/", permanent: true },
      { source: "/weg/default.asp", destination: "/der-weg", permanent: true },
      { source: "/kursangebot/default.asp", destination: "/kursangebot", permanent: true },
      { source: "/anmeldung/default.asp", destination: "/kursdaten-anmeldung", permanent: true },
      { source: "/vorschriften_auto/default.asp", destination: "/vorschriften/auto", permanent: true },
      { source: "/vorschriften_motorrad/default.asp", destination: "/vorschriften/motorrad", permanent: true },
      { source: "/boegle/default.asp", destination: "/kursangebot/boegle", permanent: true },
      { source: "/bilder/default.asp", destination: "/galerie", permanent: true },
      { source: "/kontakt/default.asp", destination: "/kontakt", permanent: true },
    ];
  },
};

export default nextConfig;
