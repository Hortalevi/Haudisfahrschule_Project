"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createTestimonial, deleteTestimonial, updateTestimonial } from "./actions";

export type Testimonial = { id: string; name: string; course: string; rating: number; quote: string; sortOrder: number };

function TestimonialFields({ initial }: { initial: Omit<Testimonial, "id"> }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Name
          </Label>
          <Input id="name" name="name" defaultValue={initial.name} required />
        </div>
        <div>
          <Label htmlFor="course" required>
            Kurs
          </Label>
          <Input id="course" name="course" defaultValue={initial.course} required />
        </div>
      </div>
      <div>
        <Label htmlFor="quote" required>
          Zitat
        </Label>
        <Textarea id="quote" name="quote" rows={3} defaultValue={initial.quote} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="rating" required>
            Bewertung (1-5)
          </Label>
          <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={initial.rating} required />
        </div>
        <div>
          <Label htmlFor="sortOrder">Reihenfolge</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={initial.sortOrder} />
        </div>
      </div>
    </>
  );
}

function TestimonialRow({ item }: { item: Testimonial }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            startTransition(async () => {
              setError(null);
              const result = await updateTestimonial(item.id, undefined, formData);
              if (result?.error) {
                setError(result.error);
                return;
              }
              setEditing(false);
              router.refresh();
            });
          }}
          className="space-y-4"
        >
          <TestimonialFields initial={item} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Speichern"}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setEditing(false)}>
              <X className="h-4 w-4" />
              Abbrechen
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card className="flex items-start justify-between gap-4">
      <div>
        <div className="flex gap-0.5 text-ember-500">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <p className="mt-1.5 text-sm text-sand-700">&ldquo;{item.quote}&rdquo;</p>
        <p className="mt-1.5 text-sm font-semibold text-navy-950">
          {item.name} <span className="font-normal text-sand-500">· {item.course}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              if (!window.confirm("Diese Bewertung wirklich löschen?")) return;
              await deleteTestimonial(item.id);
              router.refresh();
            })
          }
        >
          <Trash2 className="h-3.5 w-3.5 text-red-600" />
        </Button>
      </div>
    </Card>
  );
}

function TestimonialNewForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Neue Bewertung
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
            const result = await createTestimonial(undefined, formData);
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
        <TestimonialFields initial={{ name: "", course: "", rating: 5, quote: "", sortOrder: 0 }} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hinzufügen"}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function TestimonialManager({ items }: { items: Testimonial[] }) {
  return (
    <div className="mt-6 space-y-3">
      {items.map((item) => (
        <TestimonialRow key={item.id} item={item} />
      ))}
      <TestimonialNewForm />
    </div>
  );
}
