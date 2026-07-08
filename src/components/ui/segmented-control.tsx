"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export function SegmentedControl({
  options,
  value,
  onValueChange,
  className,
}: {
  options: { id: string; label: string; description?: string }[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5",
        className,
      )}
    >
      {options.map((option) => {
        const checked = value === option.id;
        return (
          <RadioGroupPrimitive.Item
            key={option.id}
            value={option.id}
            className={cn(
              "focus-ring group rounded-lg border px-4 py-3 text-left transition-all duration-200",
              checked
                ? "border-ember-700 bg-ember-700 text-white shadow-elevated"
                : "border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10",
            )}
          >
            <span className="block font-display text-sm font-bold">{option.label}</span>
            {option.description && (
              <span
                className={cn(
                  "mt-0.5 block text-xs",
                  checked ? "text-white/90" : "text-white/60",
                )}
              >
                {option.description}
              </span>
            )}
          </RadioGroupPrimitive.Item>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
}
