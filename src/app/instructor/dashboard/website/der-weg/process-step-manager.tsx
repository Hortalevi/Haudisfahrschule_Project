"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createProcessStep, deleteProcessStep, updateProcessStep } from "./actions";

export type ProcessStep = { id: string; step: number; title: string; description: string; sortOrder: number };

function ProcessStepFields({ initial }: { initial: Omit<ProcessStep, "id"> }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="step" required>
            Schritt-Nummer
          </Label>
          <Input id="step" name="step" type="number" min={1} defaultValue={initial.step} required />
        </div>
        <div>
          <Label htmlFor="sortOrder">Reihenfolge</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={initial.sortOrder} />
        </div>
      </div>
      <div>
        <Label htmlFor="title" required>
          Titel
        </Label>
        <Input id="title" name="title" defaultValue={initial.title} required />
      </div>
      <div>
        <Label htmlFor="description" required>
          Beschreibung
        </Label>
        <Textarea id="description" name="description" rows={3} defaultValue={initial.description} required />
      </div>
    </>
  );
}

function ProcessStepRow({ item }: { item: ProcessStep }) {
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
              const result = await updateProcessStep(item.id, undefined, formData);
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
          <ProcessStepFields initial={item} />
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
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-sm font-bold text-white">
          {item.step}
        </div>
        <div>
          <p className="font-display font-bold text-navy-950">{item.title}</p>
          <p className="mt-1 text-sm text-sand-600">{item.description}</p>
        </div>
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
              if (!window.confirm("Diesen Schritt wirklich löschen?")) return;
              await deleteProcessStep(item.id);
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

function ProcessStepNewForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Neuer Schritt
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
            const result = await createProcessStep(undefined, formData);
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
        <ProcessStepFields initial={{ step: 1, title: "", description: "", sortOrder: 0 }} />
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

export function ProcessStepManager({ items }: { items: ProcessStep[] }) {
  return (
    <div className="mt-6 space-y-3">
      {items.map((item) => (
        <ProcessStepRow key={item.id} item={item} />
      ))}
      <ProcessStepNewForm />
    </div>
  );
}
