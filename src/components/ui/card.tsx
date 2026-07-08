import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-navy-900/8 bg-white p-6 shadow-soft transition-all duration-300",
        className,
      )}
      {...props}
    />
  );
}
