import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("mb-2 block text-sm font-semibold text-navy-900", className)}
    {...props}
  >
    {children}
    {required && <span className="text-ember-800"> *</span>}
  </label>
));
Label.displayName = "Label";

export { Label };
