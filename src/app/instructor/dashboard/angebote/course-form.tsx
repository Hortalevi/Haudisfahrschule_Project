"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CourseFormState } from "./actions";

const selectClass =
  "focus-ring h-12 w-full rounded-md border border-sand-300 bg-white px-4 text-[0.95rem] text-navy-900";

export type CourseFormValues = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  category: string;
  audience: string;
  priceFrom: number | null;
  priceUnit: string;
  priceNote: string;
  summary: string;
  highlightsText: string;
  languagesText: string;
  duration: string;
  ctaLabel: string;
  sectionsText: string;
  costPerSession: number;
  active: boolean;
};

export function CourseForm({
  action,
  initial,
  submitLabel,
  lockSlug,
}: {
  action: (state: CourseFormState, formData: FormData) => Promise<CourseFormState>;
  initial: CourseFormValues;
  submitLabel: string;
  lockSlug?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="slug" required>
            Slug (URL)
          </Label>
          <Input id="slug" name="slug" defaultValue={initial.slug} required disabled={lockSlug} />
        </div>
        <div>
          <Label htmlFor="title" required>
            Titel
          </Label>
          <Input id="title" name="title" defaultValue={initial.title} required />
        </div>
      </div>

      <div>
        <Label htmlFor="tagline" required>
          Untertitel
        </Label>
        <Input id="tagline" name="tagline" defaultValue={initial.tagline} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="icon" required>
            Icon
          </Label>
          <select id="icon" name="icon" defaultValue={initial.icon} className={selectClass}>
            {["steering-wheel", "bike", "heart-pulse", "book-open", "clipboard-check", "truck", "car-taxi"].map(
              (opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ),
            )}
          </select>
        </div>
        <div>
          <Label htmlFor="category" required>
            Kategorie
          </Label>
          <select id="category" name="category" defaultValue={initial.category} className={selectClass}>
            {["pflicht", "auto", "motorrad", "zusatz"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="audience" required>
            Zielgruppe
          </Label>
          <select id="audience" name="audience" defaultValue={initial.audience} className={selectClass}>
            {["auto", "motorrad", "nothelfer", "vku-btu", "boegle"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="priceFrom">Preis ab (CHF)</Label>
          <Input
            id="priceFrom"
            name="priceFrom"
            type="number"
            min={0}
            defaultValue={initial.priceFrom ?? ""}
            placeholder="leer = auf Anfrage"
          />
        </div>
        <div>
          <Label htmlFor="priceUnit" required>
            Preiseinheit
          </Label>
          <Input id="priceUnit" name="priceUnit" defaultValue={initial.priceUnit} required />
        </div>
        <div>
          <Label htmlFor="priceNote">Preishinweis</Label>
          <Input id="priceNote" name="priceNote" defaultValue={initial.priceNote} />
        </div>
      </div>

      <div>
        <Label htmlFor="summary" required>
          Zusammenfassung
        </Label>
        <Textarea id="summary" name="summary" rows={3} defaultValue={initial.summary} required />
      </div>

      <div>
        <Label htmlFor="highlightsText" required>
          Highlights (eine Zeile pro Punkt)
        </Label>
        <Textarea id="highlightsText" name="highlightsText" rows={4} defaultValue={initial.highlightsText} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="languagesText">Sprachen (eine Zeile pro Sprache)</Label>
          <Textarea id="languagesText" name="languagesText" rows={3} defaultValue={initial.languagesText} />
        </div>
        <div>
          <Label htmlFor="duration">Dauer</Label>
          <Input id="duration" name="duration" defaultValue={initial.duration} />
        </div>
      </div>

      <div>
        <Label htmlFor="ctaLabel" required>
          Button-Text
        </Label>
        <Input id="ctaLabel" name="ctaLabel" defaultValue={initial.ctaLabel} required />
      </div>

      <div>
        <Label htmlFor="sectionsText" required>
          Inhalt-Abschnitte
        </Label>
        <p className="mb-2 text-xs text-sand-500">
          Format: <code>## Überschrift</code> gefolgt von je einer Zeile pro Absatz. Leerzeile vor der nächsten
          Überschrift.
        </p>
        <Textarea id="sectionsText" name="sectionsText" rows={10} defaultValue={initial.sectionsText} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="costPerSession">Kosten pro Termin (CHF)</Label>
          <Input
            id="costPerSession"
            name="costPerSession"
            type="number"
            min={0}
            step="0.01"
            defaultValue={initial.costPerSession}
          />
        </div>
        <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold text-navy-900">
          <input
            type="checkbox"
            name="active"
            defaultChecked={initial.active}
            className="focus-ring h-4 w-4 rounded border-sand-300 text-ember-500"
          />
          Aktiv (auf der Website sichtbar)
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className={cn(pending && "opacity-70")}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}
