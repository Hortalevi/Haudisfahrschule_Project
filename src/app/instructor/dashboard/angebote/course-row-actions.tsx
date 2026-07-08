"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCourse, toggleCourseActive } from "./actions";

export function CourseRowActions({ slug, active }: { slug: string; active: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 text-sm text-sand-600">
        <input
          type="checkbox"
          defaultChecked={active}
          disabled={pending}
          className="focus-ring h-4 w-4 rounded border-sand-300 text-ember-500"
          onChange={(e) =>
            startTransition(async () => {
              await toggleCourseActive(slug, e.target.checked);
              router.refresh();
            })
          }
        />
        Aktiv
      </label>
      <Button asChild size="sm" variant="outline">
        <Link href={`/instructor/dashboard/angebote/${slug}`}>
          <Pencil className="h-3.5 w-3.5" />
          Bearbeiten
        </Link>
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            if (!window.confirm(`Angebot "${slug}" wirklich löschen?`)) return;
            await deleteCourse(slug);
            router.refresh();
          })
        }
      >
        <Trash2 className="h-3.5 w-3.5 text-red-600" />
      </Button>
    </div>
  );
}
