import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

// Money is admin-only (see backend SecurityConfig) - mirrors benutzer/layout.tsx.
export default async function UmsatzLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) redirect("/instructor/dashboard");
  return children;
}
