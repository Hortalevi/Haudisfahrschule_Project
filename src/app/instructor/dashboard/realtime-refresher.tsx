"use client";

import { useRouter } from "next/navigation";
import { useRealtime } from "@/lib/use-realtime";
import { cn } from "@/lib/utils";

export function RealtimeRefresher() {
  const router = useRouter();
  const status = useRealtime(() => router.refresh());

  return (
    <span className="flex items-center gap-1.5 px-1 text-xs text-sand-500">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "open" ? "bg-moss-500" : status === "connecting" ? "bg-ember-400" : "bg-sand-300",
        )}
      />
      {status === "open" ? "Live" : status === "connecting" ? "Verbinde…" : "Getrennt"}
    </span>
  );
}
