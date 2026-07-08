import { cn } from "@/lib/utils";

export function Eyebrow({
  tone = "dark",
  className,
  children,
}: {
  tone?: "dark" | "light";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider",
        tone === "dark" ? "text-ember-800" : "text-ember-400",
        className,
      )}
    >
      <span className="inline-block h-2.5 w-6 rounded-full bg-yellow-400" aria-hidden />
      {children}
    </span>
  );
}

export function Section({
  className,
  tone = "light",
  ...props
}: React.HTMLAttributes<HTMLElement> & { tone?: "light" | "sand" | "navy" }) {
  return (
    <section
      className={cn(
        "py-20 sm:py-28",
        tone === "sand" && "bg-sand-100",
        tone === "navy" && "bg-navy-900 text-white",
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow tone={tone === "dark" ? "dark" : "light"} className="mb-3">
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "text-balance text-3xl font-bold tracking-tight sm:text-4xl",
          tone === "dark" ? "text-navy-950" : "text-white",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            tone === "dark" ? "text-sand-600" : "text-white/70",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
