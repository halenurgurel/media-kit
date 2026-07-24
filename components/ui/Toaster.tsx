"use client";

import { useEffect } from "react";
import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

const AUTO_DISMISS_MS = 5000;

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} message={toast.message} variant={toast.variant} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  variant,
  onDismiss,
}: {
  id: string;
  message: string;
  variant: "success" | "error";
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timeout = setTimeout(() => onDismiss(id), AUTO_DISMISS_MS);
    return () => clearTimeout(timeout);
  }, [id, onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-center gap-2 rounded-md border px-4 py-3 text-sm shadow-md",
        variant === "success" && "border-mauve-200 bg-mauve-50 text-mauve-800",
        variant === "error" && "border-red-200 bg-red-50 text-red-700"
      )}
    >
      <span>{message}</span>
      <button
        onClick={() => onDismiss(id)}
        className="ml-2 text-xs text-charcoal-400 hover:text-charcoal-600"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
