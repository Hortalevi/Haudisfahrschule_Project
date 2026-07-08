"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listToText } from "@/lib/course-content-format";
import { createRegulation, deleteRegulation, updateRegulation } from "./actions";

export type Regulation = {
  id: string;
  vehicleType: "AUTO" | "MOTORRAD";
  question: string;
  answer: string[];
  sortOrder: number;
};

const selectClass = "focus-ring h-12 w-full rounded-md border border-sand-300 bg-white px-4 text-[0.95rem] text-navy-900";

function RegulationFields({ initial }: { initial: Omit<Regulation, "id"> }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="vehicleType" required>
            Fahrzeugtyp
          </Label>
          <select id="vehicleType" name="vehicleType" defaultValue={initial.vehicleType} className={selectClass}>
            <option value="AUTO">Auto</option>
            <option value="MOTORRAD">Motorrad</option>
          </select>
        </div>
        <div>
          <Label htmlFor="sortOrder">Reihenfolge</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={initial.sortOrder} />
        </div>
      </div>
      <div>
        <Label htmlFor="question" required>
          Frage
        </Label>
        <Input id="question" name="question" defaultValue={initial.question} required />
      </div>
      <div>
        <Label htmlFor="answerText" required>
          Antwort (ein Absatz pro Zeile)
        </Label>
        <Textarea id="answerText" name="answerText" rows={4} defaultValue={listToText(initial.answer)} required />
      </div>
    </>
  );
}

function RegulationRow({ item }: { item: Regulation }) {
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
              const result = await updateRegulation(item.id, undefined, formData);
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
          <RegulationFields initial={item} />
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
        <Badge variant={item.vehicleType === "AUTO" ? "outline" : "navy"}>
          {item.vehicleType === "AUTO" ? "Auto" : "Motorrad"}
        </Badge>
        <p className="mt-1.5 font-display font-bold text-navy-950">{item.question}</p>
        <p className="mt-1 text-sm text-sand-600">{item.answer[0]}</p>
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
              if (!window.confirm("Diesen Abschnitt wirklich löschen?")) return;
              await deleteRegulation(item.id);
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

function RegulationNewForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Neuer Abschnitt
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
            const result = await createRegulation(undefined, formData);
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
        <RegulationFields initial={{ vehicleType: "AUTO", question: "", answer: [], sortOrder: 0 }} />
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

export function RegulationManager({ items }: { items: Regulation[] }) {
  return (
    <div className="mt-6 space-y-3">
      {items.map((item) => (
        <RegulationRow key={item.id} item={item} />
      ))}
      <RegulationNewForm />
    </div>
  );
}
