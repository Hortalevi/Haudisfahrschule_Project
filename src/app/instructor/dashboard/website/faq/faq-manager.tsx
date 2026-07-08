"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createFaqItem, deleteFaqItem, updateFaqItem } from "./actions";

export type FaqItem = { id: string; question: string; answer: string; sortOrder: number };

function FaqFields({ initial }: { initial: Omit<FaqItem, "id"> }) {
  return (
    <>
      <div>
        <Label htmlFor="question" required>
          Frage
        </Label>
        <Input id="question" name="question" defaultValue={initial.question} required />
      </div>
      <div>
        <Label htmlFor="answer" required>
          Antwort
        </Label>
        <Textarea id="answer" name="answer" rows={3} defaultValue={initial.answer} required />
      </div>
      <div>
        <Label htmlFor="sortOrder">Reihenfolge</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={initial.sortOrder} className="max-w-32" />
      </div>
    </>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (editing) {
    return (
      <Card>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            startTransition(async () => {
              setError(null);
              const result = await updateFaqItem(item.id, undefined, formData);
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
          <FaqFields initial={item} />
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
        <p className="font-display font-bold text-navy-950">{item.question}</p>
        <p className="mt-1 text-sm text-sand-600">{item.answer}</p>
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
              if (!window.confirm("Diesen Eintrag wirklich löschen?")) return;
              await deleteFaqItem(item.id);
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

function FaqNewForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Neue Frage
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
            const result = await createFaqItem(undefined, formData);
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
        <FaqFields initial={{ question: "", answer: "", sortOrder: 0 }} />
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

export function FaqManager({ items }: { items: FaqItem[] }) {
  return (
    <div className="mt-6 space-y-3">
      {items.map((item) => (
        <FaqRow key={item.id} item={item} />
      ))}
      <FaqNewForm />
    </div>
  );
}
