"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { useEditorStore } from "@/store/useEditorStore";
import { useToastStore } from "@/store/useToastStore";
import { MediaKitPDFDocument } from "@/lib/generateMediaKitPDF";
import { cn } from "@/lib/utils";

const TURKISH_TRANSLITERATIONS: Record<string, string> = {
  ç: "c", Ç: "C",
  ğ: "g", Ğ: "G",
  ı: "i",
  İ: "I",
  ö: "o", Ö: "O",
  ş: "s", Ş: "S",
  ü: "u", Ü: "U",
};

function sanitizeFileName(value: string): string {
  const transliterated = value.replace(/[çÇğĞıİöÖşŞüÜ]/g, (ch) => TURKISH_TRANSLITERATIONS[ch] ?? ch);
  const cleaned = transliterated.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
  return cleaned || "media-kit";
}

export function DownloadPdfButton() {
  const draft = useEditorStore((state) => state.draft);
  const showToast = useToastStore((state) => state.showToast);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    setIsGenerating(true);
    try {
      const blob = await pdf(<MediaKitPDFDocument mediaKit={draft} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFileName(draft.displayName)}-MediaKit.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast("Failed to generate PDF. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border border-cream-200 bg-cream-100 px-4 py-2 text-sm font-medium text-charcoal-900 transition-colors hover:bg-cream-200 disabled:pointer-events-none disabled:opacity-50"
      )}
    >
      {isGenerating ? (
        <>
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-charcoal-400/40 border-t-charcoal-600"
          />
          Generating...
        </>
      ) : (
        "Download PDF"
      )}
    </button>
  );
}
