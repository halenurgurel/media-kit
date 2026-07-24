"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEditorStore } from "@/store/useEditorStore";
import { useSaveMediaKit } from "@/lib/queries/mediakit.queries";
import { useToastStore } from "@/store/useToastStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// @react-pdf/renderer touches browser-only APIs, so the whole PDF-generation
// component (and its module graph) must be excluded from the SSR bundle.
const DownloadPdfButton = dynamic(
  () => import("@/components/editor/DownloadPdfButton").then((mod) => mod.DownloadPdfButton),
  { ssr: false }
);

export function EditorHeader() {
  const draft = useEditorStore((state) => state.draft);
  const isDirty = useEditorStore((state) => state.isDirty);
  const showToast = useToastStore((state) => state.showToast);
  const saveMediaKit = useSaveMediaKit();

  async function handleSave() {
    try {
      await saveMediaKit.mutateAsync(draft);
      showToast("Media kit saved.", "success");
    } catch {
      // useSaveMediaKit's onError already surfaces a toast.
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-cream-200 bg-cream-50 px-6 py-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-sm font-medium text-charcoal-600 hover:underline">
          ← Dashboard
        </Link>
        <h1 className="text-lg font-semibold text-charcoal-900">Media Kit Editor</h1>
        {isDirty && (
          <span className="rounded-full bg-mauve-50 px-2.5 py-1 text-xs font-medium text-mauve-800">
            Unsaved changes
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <DownloadPdfButton />
        <Button
          type="button"
          onClick={handleSave}
          disabled={saveMediaKit.isPending || !isDirty}
          className={cn(saveMediaKit.isPending && "opacity-70")}
        >
          {saveMediaKit.isPending ? (
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
              Saving...
            </span>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </header>
  );
}
