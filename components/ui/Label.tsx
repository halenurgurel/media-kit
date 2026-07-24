import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("mb-1 block text-sm font-medium text-charcoal-600", className)}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";
