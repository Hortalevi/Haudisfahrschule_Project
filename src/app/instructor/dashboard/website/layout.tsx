import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

// Defense in depth: the nav only shows these links to admins, and the Java
// API rejects non-admins at the data layer regardless - this just turns that
// into a clean redirect instead of an error page if someone lands here directly.
export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) redirect("/instructor/dashboard");
  return children;
}
