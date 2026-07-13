import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  BarChart3,
  LogOut,
  BookOpen,
  Globe,
  Users,
} from "lucide-react";
import { getCurrentUser } from "@/lib/api";
import { logoutInstructor } from "@/app/instructor/actions";
import { RealtimeRefresher } from "./realtime-refresher";
import { DeleteAccountButton } from "./delete-account-button";

const baseNavItems = [
  { href: "/instructor/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/instructor/dashboard/angebote", label: "Angebote", icon: BookOpen },
  { href: "/instructor/dashboard/kalender", label: "Kalender", icon: CalendarDays },
  { href: "/instructor/dashboard/anmeldungen", label: "Anmeldungen", icon: ClipboardList },
];

// Money is admin-only (see backend SecurityConfig: /api/stats/revenue and
// /api/stats/commissions require ROLE_ADMIN) - a plain instructor must not
// see how much the school makes, even if they can also teach.
const adminNavItems = [
  { href: "/instructor/dashboard/umsatz", label: "Umsatz", icon: BarChart3 },
  { href: "/instructor/dashboard/website", label: "Website", icon: Globe },
  { href: "/instructor/dashboard/benutzer", label: "Benutzer", icon: Users },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/instructor/login");

  const navItems = user.isAdmin ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] bg-sand-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-900/8 bg-white p-5 sm:flex">
        <Link href="/" className="flex items-center gap-2.5 px-1">
          <Image src="/images/haudis-logo.png" alt="Haudi's" width={173} height={78} className="h-9 w-auto rounded-sm" />
          <span className="font-display text-sm font-bold text-navy-950">Fahrlehrer-Bereich</span>
        </Link>

        <div className="mt-3 px-1">
          <RealtimeRefresher />
        </div>

        <nav className="mt-5 flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-900/5"
            >
              <item.icon className="h-4 w-4 text-navy-500" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-navy-900/8 pt-4">
          <p className="truncate px-1 text-sm font-semibold text-navy-950">{user.name}</p>
          <p className="truncate px-1 text-xs text-sand-500">{user.email}</p>
          <p className="px-1 text-xs text-sand-400">
            {user.isAdmin && user.isInstructor ? "Admin & Fahrlehrer/-in" : user.isAdmin ? "Admin" : "Fahrlehrer/-in"}
          </p>
          <form action={logoutInstructor} className="mt-3">
            <button
              type="submit"
              className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-sand-600 hover:bg-navy-900/5"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </button>
          </form>
          <DeleteAccountButton />
        </div>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <nav className="flex items-center gap-1 overflow-x-auto border-b border-navy-900/8 bg-white px-4 py-2 sm:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-navy-900/5"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
