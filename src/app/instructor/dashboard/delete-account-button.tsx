"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { UserX } from "lucide-react";
import { deleteOwnAccount } from "@/app/instructor/actions";

export function DeleteAccountButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-1">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            if (!window.confirm("Dein Konto wird endgültig gelöscht. Fortfahren?")) return;
            setError(null);
            try {
              await deleteOwnAccount();
              router.push("/instructor/login");
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Konto konnte nicht gelöscht werden.");
            }
          })
        }
        className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        <UserX className="h-4 w-4" />
        Konto löschen
      </button>
      {error && <p className="px-3 text-xs text-red-600">{error}</p>}
    </div>
  );
}
