import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        ember: "bg-ember-500/10 text-ember-800",
        navy: "bg-navy-900/8 text-navy-800",
        moss: "bg-moss-100 text-moss-700",
        outline: "border border-white/40 text-white",
      },
    },
    defaultVariants: { variant: "ember" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
