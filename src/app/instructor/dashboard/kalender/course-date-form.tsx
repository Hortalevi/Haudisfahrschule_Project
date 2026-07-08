"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { CourseDateFormState } from "./actions";

const selectClass =
  "focus-ring h-12 w-full rounded-md border border-sand-300 bg-white px-4 text-[0.95rem] text-navy-900";

export type CourseDateFormValues = {
  courseSlug: string;
  dateLabel: string;
  timeSlotsText: string;
  startsAt: string;
  endsAt: string;
  location: string;
  price: number;
  capacity: number;
  instructorId: string;
  notes: string;
};

export function CourseDateForm({
  action,
  initial,
  submitLabel,
  courses,
  instructors,
}: {
  action: (state: CourseDateFormState, formData: FormData) => Promise<CourseDateFormState>;
  initial: CourseDateFormValues;
  submitLabel: string;
  courses: { slug: string; title: string }[];
  instructors: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-6 max-w-xl space-y-6">
      <div>
        <Label htmlFor="courseSlug" required>
          Kurs
        </Label>
        <select id="courseSlug" name="courseSlug" defaultValue={initial.courseSlug} className={selectClass} required>
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="dateLabel" required>
          Datumsbezeichnung
        </Label>
        <Input
          id="dateLabel"
          name="dateLabel"
          defaultValue={initial.dateLabel}
          placeholder="z.B. Mo 20. – Do 23. Juli 2026"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="startsAt" required>
            Start
          </Label>
          <Input id="startsAt" name="startsAt" type="datetime-local" defaultValue={initial.startsAt} required />
        </div>
        <div>
          <Label htmlFor="endsAt">Ende (optional)</Label>
          <Input id="endsAt" name="endsAt" type="datetime-local" defaultValue={initial.endsAt} />
        </div>
      </div>

      <div>
        <Label htmlFor="timeSlotsText" required>
          Zeiten (eine Zeile pro Slot)
        </Label>
        <Textarea
          id="timeSlotsText"
          name="timeSlotsText"
          rows={3}
          defaultValue={initial.timeSlotsText}
          placeholder="18.00–20.00 Uhr"
          required
        />
      </div>

      <div>
        <Label htmlFor="location" required>
          Ort
        </Label>
        <Input id="location" name="location" defaultValue={initial.location} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="price" required>
            Preis (CHF)
          </Label>
          <Input id="price" name="price" type="number" min={0} defaultValue={initial.price} required />
        </div>
        <div>
          <Label htmlFor="capacity" required>
            Plätze
          </Label>
          <Input id="capacity" name="capacity" type="number" min={1} defaultValue={initial.capacity} required />
        </div>
      </div>

      <div>
        <Label htmlFor="instructorId">Fahrlehrer/-in</Label>
        <select id="instructorId" name="instructorId" defaultValue={initial.instructorId} className={selectClass}>
          <option value="">Nicht zugewiesen</option>
          {instructors.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="notes">Notizen (intern)</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={initial.notes} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}
