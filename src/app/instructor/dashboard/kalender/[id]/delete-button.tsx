"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCourseDate } from "../actions";

export function DeleteCourseDateButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          if (!window.confirm("Diesen Termin wirklich löschen?")) return;
          await deleteCourseDate(id);
          router.push("/instructor/dashboard/kalender");
        })
      }
    >
      <Trash2 className="h-4 w-4 text-red-600" />
      Löschen
    </Button>
  );
}
