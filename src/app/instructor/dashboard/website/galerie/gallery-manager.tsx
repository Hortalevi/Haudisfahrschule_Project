"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createGalleryImage, deleteGalleryImage, updateGalleryImage } from "./actions";

export type GalleryImage = { id: string; src: string; alt: string; category: string; sortOrder: number };

function GalleryFields({ initial }: { initial: Omit<GalleryImage, "id"> }) {
  return (
    <>
      <div>
        <Label htmlFor="src" required>
          Bildpfad oder URL
        </Label>
        <Input id="src" name="src" defaultValue={initial.src} placeholder="/images/gallery/beispiel.jpg" required />
      </div>
      <div>
        <Label htmlFor="alt" required>
          Alt-Text (Beschreibung)
        </Label>
        <Input id="alt" name="alt" defaultValue={initial.alt} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="category" required>
            Kategorie
          </Label>
          <Input id="category" name="category" defaultValue={initial.category} placeholder="fahrzeuge" required />
        </div>
        <div>
          <Label htmlFor="sortOrder">Reihenfolge</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={initial.sortOrder} />
        </div>
      </div>
    </>
  );
}

function GalleryRow({ item }: { item: GalleryImage }) {
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
              const result = await updateGalleryImage(item.id, undefined, formData);
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
          <GalleryFields initial={item} />
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
    <Card className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sand-100">
          {item.src && (
            <Image src={item.src} alt={item.alt} fill sizes="56px" className="object-cover" unoptimized />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-950">{item.alt}</p>
          <p className="text-xs text-sand-500">{item.category}</p>
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
              if (!window.confirm("Dieses Bild wirklich löschen?")) return;
              await deleteGalleryImage(item.id);
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

function GalleryNewForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Neues Bild
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
            const result = await createGalleryImage(undefined, formData);
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
        <GalleryFields initial={{ src: "", alt: "", category: "fahrzeuge", sortOrder: 0 }} />
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

export function GalleryManager({ items }: { items: GalleryImage[] }) {
  return (
    <div className="mt-6 space-y-3">
      {items.map((item) => (
        <GalleryRow key={item.id} item={item} />
      ))}
      <GalleryNewForm />
    </div>
  );
}
