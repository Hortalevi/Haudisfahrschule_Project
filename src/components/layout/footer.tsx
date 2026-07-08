import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { footerCourseLinks, primaryNav } from "@/content/site";
import { getSiteSettings } from "@/lib/site-settings";

export async function Footer() {
  const site = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-[3px] border-yellow-400 bg-navy-950 text-white">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/images/haudis-logo.png"
            alt="Haudi's Verkehrsschule"
            width={173}
            height={78}
            className="h-12 w-auto rounded-sm"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {site.description}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
            Navigation
          </h3>
          <ul className="mt-4 space-y-2.5">
            {primaryNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="focus-ring text-[0.95rem] text-white/80 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
            Kursangebot
          </h3>
          <ul className="mt-4 space-y-2.5">
            {footerCourseLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="focus-ring text-[0.95rem] text-white/80 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
            Kontakt
          </h3>
          <ul className="mt-4 space-y-3 text-[0.95rem] text-white/80">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
              <Link href="/standort" className="focus-ring hover:text-white">
                {site.addressStreet}
                <br />
                {site.addressPostalCode} {site.addressCity}
              </Link>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-ember-500" />
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="focus-ring hover:text-white">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-ember-500" />
              <a href={`mailto:${site.email}`} className="focus-ring hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {site.legalName}. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-5">
            <Link href="/impressum" className="focus-ring hover:text-white">
              Impressum
            </Link>
            <Link href="/datenschutz" className="focus-ring hover:text-white">
              Datenschutz
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
