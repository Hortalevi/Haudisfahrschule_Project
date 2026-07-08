"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createUser, deleteUser, updateUserRoles } from "./actions";

export type AppUser = { id: string; name: string; email: string; isAdmin: boolean; isInstructor: boolean };

function UserRow({ user, isLastAdmin, currentUserId }: { user: AppUser; isLastAdmin: boolean; currentUserId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const disableAdminToggle = user.isAdmin && isLastAdmin;

  function toggleRole(role: "isAdmin" | "isInstructor", checked: boolean) {
    const next = {
      isAdmin: role === "isAdmin" ? checked : user.isAdmin,
      isInstructor: role === "isInstructor" ? checked : user.isInstructor,
    };
    if (!next.isAdmin && !next.isInstructor) {
      setError("Mindestens eine Rolle ist erforderlich.");
      return;
    }
    startTransition(async () => {
      setError(null);
      const result = await updateUserRoles(user.id, next.isAdmin, next.isInstructor);
      if (result?.error) setError(result.error);
      router.refresh();
    });
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display font-bold text-navy-950">
            {user.name} {user.id === currentUserId && <span className="text-xs font-normal text-sand-500">(du)</span>}
          </p>
          <p className="text-sm text-sand-600">{user.email}</p>
        </div>
        <div className="flex items-center gap-5">
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              checked={user.isAdmin}
              disabled={pending || disableAdminToggle}
              onChange={(e) => toggleRole("isAdmin", e.target.checked)}
              className="focus-ring h-4 w-4 rounded border-sand-300 text-ember-500"
            />
            Admin
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              checked={user.isInstructor}
              disabled={pending}
              onChange={(e) => toggleRole("isInstructor", e.target.checked)}
              className="focus-ring h-4 w-4 rounded border-sand-300 text-ember-500"
            />
            Fahrlehrer/-in
          </label>
          <Button
            size="sm"
            variant="ghost"
            disabled={pending || disableAdminToggle}
            title={disableAdminToggle ? "Der letzte Admin-Account kann nicht gelöscht werden." : undefined}
            onClick={() =>
              startTransition(async () => {
                if (!window.confirm(`${user.name} wirklich löschen?`)) return;
                setError(null);
                const result = await deleteUser(user.id);
                if (result?.error) {
                  setError(result.error);
                  return;
                }
                router.refresh();
              })
            }
          >
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
          </Button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </Card>
  );
}

function NewUserForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Neuer Benutzer
      </Button>
    );
  }

  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startTransition(async () => {
            setError(null);
            const result = await createUser(undefined, formData);
            if (result?.error) {
              setError(result.error);
              return;
            }
            setOpen(false);
            router.refresh();
          });
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" required>
              Name
            </Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email" required>
              E-Mail
            </Label>
            <Input id="email" name="email" type="email" required />
          </div>
        </div>
        <div>
          <Label htmlFor="password" required>
            Passwort
          </Label>
          <Input id="password" name="password" type="password" minLength={8} required autoComplete="new-password" />
        </div>
        <div className="flex items-center gap-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-navy-900">
            <input type="checkbox" name="isAdmin" className="focus-ring h-4 w-4 rounded border-sand-300 text-ember-500" />
            Admin
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-navy-900">
            <input
              type="checkbox"
              name="isInstructor"
              defaultChecked
              className="focus-ring h-4 w-4 rounded border-sand-300 text-ember-500"
            />
            Fahrlehrer/-in
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Erstellen"}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function UserManager({ users, currentUserId }: { users: AppUser[]; currentUserId: string }) {
  const adminCount = users.filter((u) => u.isAdmin).length;

  return (
    <div className="mt-6 space-y-3">
      {users.map((user) => (
        <UserRow key={user.id} user={user} isLastAdmin={adminCount <= 1} currentUserId={currentUserId} />
      ))}
      <NewUserForm />
    </div>
  );
}
