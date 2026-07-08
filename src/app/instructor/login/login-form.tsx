"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    startTransition(async () => {
      setError(null);
      // Login runs client-side (not as a Server Action) so the browser receives
      // the Java backend's Set-Cookie headers directly through the same-origin
      // /api/backend rewrite - a server-to-server call couldn't relay those.
      await fetch("/api/backend/auth/csrf", { credentials: "include" });
      const csrfToken = readCookie("XSRF-TOKEN");

      const res = await fetch("/api/backend/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}),
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.message ?? "Anmeldung fehlgeschlagen.");
        return;
      }

      router.push("/instructor/dashboard");
      router.refresh();
    });
  }

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="email" required>
          E-Mail
        </Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="password" required>
          Passwort
        </Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Wird angemeldet…
          </>
        ) : (
          "Anmelden"
        )}
      </Button>
    </form>
  );
}
