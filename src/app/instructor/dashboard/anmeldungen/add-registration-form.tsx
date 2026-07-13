"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createRegistration } from "./actions";

const languages = ["Deutsch", "Italienisch", "Spanisch", "Französisch", "Englisch"];
const selectClass =
  "focus-ring h-11 w-full rounded-md border border-sand-300 bg-white px-3 text-sm text-navy-900";

export function AddRegistrationForm({
  courseDateId,
  instructors,
}: {
  courseDateId: string;
  instructors: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
        Neue Anmeldung
      </Button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
          setError(undefined);
          const result = await createRegistration(undefined, formData);
          if (result?.error) {
            setError(result.error);
            return;
          }
          setOpen(false);
        });
      }}
      className="mt-3 space-y-3 rounded-lg border border-navy-900/8 bg-sand-50 p-4"
    >
      <input type="hidden" name="courseDateId" value={courseDateId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`firstName-${courseDateId}`} required>
            Vorname
          </Label>
          <Input id={`firstName-${courseDateId}`} name="firstName" required />
        </div>
        <div>
          <Label htmlFor={`lastName-${courseDateId}`} required>
            Nachname
          </Label>
          <Input id={`lastName-${courseDateId}`} name="lastName" required />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`email-${courseDateId}`} required>
            E-Mail
          </Label>
          <Input id={`email-${courseDateId}`} name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor={`phone-${courseDateId}`} required>
            Telefon
          </Label>
          <Input id={`phone-${courseDateId}`} name="phone" type="tel" required />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`language-${courseDateId}`}>Sprache</Label>
          <select id={`language-${courseDateId}`} name="language" defaultValue="Deutsch" className={selectClass}>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor={`instructor-${courseDateId}`}>Empfohlen von</Label>
          <select id={`instructor-${courseDateId}`} name="recommendedInstructorId" defaultValue="" className={selectClass}>
            <option value="">Keine Angabe</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hinzufügen"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setOpen(false)}>
          <X className="h-3.5 w-3.5" />
          Abbrechen
        </Button>
      </div>
    </form>
  );
}
