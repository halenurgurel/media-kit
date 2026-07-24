import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({ className, ...props }, ref) => {
  return (
    <label className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center", className)}>
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span className="absolute inset-0 rounded-full bg-cream-200 transition-colors peer-checked:bg-mauve-400" />
      <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
    </label>
  );
});

Toggle.displayName = "Toggle";
