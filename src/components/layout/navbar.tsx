"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ChevronDown, LogIn, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/content/site";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/site-settings";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ site }: { site: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on route change without an effect: derive it
  // during render by tracking the previous pathname (React's recommended
  // pattern for "adjusting state when a prop changes").
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Utility bar — black + yellow, echoing the logo's own colors so the
          brand identity reads before you even get to the nav. */}
      <div className="hidden border-b-[3px] border-yellow-400 bg-navy-950 text-white xl:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-8 text-xs font-medium xl:px-10">
          <Link href="/standort" className="focus-ring flex items-center gap-1.5 rounded-sm text-white/85 hover:text-yellow-400">
            <MapPin className="h-3.5 w-3.5 text-yellow-400" />
            {site.addressStreet}, {site.addressPostalCode} {site.addressCity}
          </Link>
          <div className="flex items-center gap-5">
            <a href={`mailto:${site.email}`} className="focus-ring flex items-center gap-1.5 rounded-sm text-white/85 hover:text-yellow-400">
              <Mail className="h-3.5 w-3.5 text-yellow-400" />
              {site.email}
            </a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="focus-ring flex items-center gap-1.5 rounded-sm text-white/85 hover:text-yellow-400">
              <Phone className="h-3.5 w-3.5 text-yellow-400" />
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "w-full border-b-[3px] border-yellow-400 transition-all duration-300 xl:border-b-0",
          scrolled ? "bg-white/95 shadow-soft backdrop-blur-md" : "bg-white/70 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-8 xl:px-6 2xl:px-10">
          <Link href="/" className="focus-ring flex shrink-0 items-center gap-3 rounded-md">
            <Image
              src="/images/haudis-logo.png"
              alt="Haudi's Verkehrsschule"
              width={173}
              height={78}
              className="h-11 w-auto rounded-sm"
              priority
            />
            <span className="hidden font-display text-xl font-extrabold tracking-tight text-navy-950 sm:inline">
              Verkehrsschule
            </span>
          </Link>

          <NavigationMenu.Root className="relative hidden xl:block" delayDuration={80}>
            <NavigationMenu.List className="flex items-center">
              {primaryNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <NavigationMenu.Item key={item.label}>
                    {item.children ? (
                      <>
                        <NavigationMenu.Trigger
                          className={cn(
                            "focus-ring group relative flex items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-semibold outline-none",
                            active ? "text-ember-800" : "text-navy-800 hover:text-ember-800",
                          )}
                        >
                          {item.label}
                          <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden />
                          <span
                            className={cn(
                              "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-yellow-400 transition-opacity",
                              active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                            )}
                          />
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className="absolute left-0 top-full w-80 rounded-lg border border-navy-900/8 bg-white p-2 shadow-elevated">
                          <ul className="grid gap-0.5">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="focus-ring block rounded-md px-3 py-2.5 text-sm font-medium text-navy-800 hover:bg-sand-100"
                                >
                                  {child.label}
                                  {child.description && (
                                    <span className="block text-xs font-normal text-sand-500">
                                      {child.description}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenu.Content>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "focus-ring group relative block whitespace-nowrap px-3 py-2 text-sm font-semibold",
                          active ? "text-ember-800" : "text-navy-800 hover:text-ember-800",
                        )}
                      >
                        {item.label}
                        <span
                          className={cn(
                            "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-yellow-400 transition-opacity",
                            active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                          )}
                        />
                      </Link>
                    )}
                  </NavigationMenu.Item>
                );
              })}
            </NavigationMenu.List>
            <NavigationMenu.Viewport />
          </NavigationMenu.Root>

          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            <Link
              href="/instructor/login"
              className="focus-ring flex items-center gap-1.5 rounded-md px-2 py-2 text-sm font-semibold text-navy-800 hover:text-ember-800"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Button asChild size="sm">
              <Link href="/kursdaten-anmeldung">Jetzt anmelden</Link>
            </Button>
          </div>

          <button
            type="button"
            className="focus-ring rounded-md p-2 text-navy-900 xl:hidden"
            aria-label={mobileOpen ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-18 z-40 h-[calc(100dvh-4.5rem)] overflow-y-auto bg-white xl:hidden">
          <nav className="flex flex-col gap-1 px-5 py-6">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <div key={item.label} className="border-b border-navy-900/8 py-1">
                  <Link
                    href={item.href}
                    className={cn(
                      "focus-ring flex items-center gap-2 rounded-md px-2 py-3 text-lg font-semibold",
                      active ? "text-ember-800" : "text-navy-950",
                    )}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-yellow-400" />}
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-3 flex flex-col gap-0.5 pb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="focus-ring rounded-md px-2 py-2 text-[0.95rem] text-sand-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <a
              href={`mailto:${site.email}`}
              className="focus-ring mt-4 flex items-center gap-2 px-2 text-sm text-sand-600"
            >
              <Mail className="h-4 w-4 text-ember-600" />
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="focus-ring mt-3 flex items-center justify-center gap-2 rounded-full border-2 border-navy-900/15 px-4 py-3 text-base font-semibold text-navy-900"
            >
              <Phone className="h-4 w-4" />
              {site.phoneDisplay}
            </a>
            <Button asChild size="lg" className="mt-3">
              <Link href="/kursdaten-anmeldung">Jetzt anmelden</Link>
            </Button>
            <Link
              href="/instructor/login"
              className="focus-ring mt-3 flex items-center justify-center gap-2 rounded-full border-2 border-navy-900/15 px-4 py-3 text-base font-semibold text-navy-900"
            >
              <LogIn className="h-4 w-4" />
              Fahrlehrer/-in &amp; Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
