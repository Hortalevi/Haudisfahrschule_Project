import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} – Fahrschule Baden, Aargau`,
      template: `%s – ${site.name}`,
    },
    description: site.description,
    keywords: [
      "Fahrschule Baden",
      "Verkehrsschule Aargau",
      "VKU Kurs Baden",
      "Nothelferkurs Baden",
      "Motorradgrundkurs Baden",
      "Fahrstunden Baden",
      "BTU Baden",
      "Fahrschule Ennetbaden",
    ],
    authors: [{ name: site.legalName }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "de_CH",
      url: site.url,
      siteName: site.name,
      title: `${site.name} – Fahrschule Baden, Aargau`,
      description: site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} – Fahrschule Baden, Aargau`,
      description: site.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    name: site.name,
    image: `${site.url}/images/gallery/a5.jpg`,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    priceRange: "CHF 88–480",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.addressStreet,
      postalCode: site.addressPostalCode,
      addressLocality: site.addressCity,
      addressRegion: site.addressRegion,
      addressCountry: site.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geoLatitude,
      longitude: site.geoLongitude,
    },
    areaServed: [
      "Baden",
      "Ennetbaden",
      "Untersiggenthal",
      "Turgi",
      "Nussbaumen",
      "Brugg",
      "Dättwil",
      "Veltheim",
    ],
    founder: site.founders.map((name) => ({ "@type": "Person", name })),
  };

  return (
    <html lang="de-CH" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-sand-50 text-navy-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
