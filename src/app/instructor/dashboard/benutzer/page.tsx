import { apiGet, getCurrentUser } from "@/lib/api";
import { UserManager, type AppUser } from "./user-manager";

export const dynamic = "force-dynamic";

export default async function BenutzerPage() {
  const [users, currentUser] = await Promise.all([apiGet<AppUser[]>("/users"), getCurrentUser()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-950">Benutzer</h1>
      <p className="mt-1 text-sm text-sand-600">
        Admin- und Fahrlehrer-Konten verwalten. Der letzte Admin-Account kann nicht herabgestuft oder gelöscht werden.
      </p>
      <UserManager users={users} currentUserId={currentUser?.id ?? ""} />
    </div>
  );
}
