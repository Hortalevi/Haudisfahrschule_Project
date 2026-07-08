import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

export default async function BenutzerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) redirect("/instructor/dashboard");
  return children;
}
