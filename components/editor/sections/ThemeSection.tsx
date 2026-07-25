"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { fontFamilyLabels, layoutDefaultColors, layoutLabels } from "@/lib/theme";
import type { MediaKitFontFamily, MediaKitLayout } from "@/types/mediakit";

const FONT_FAMILIES: MediaKitFontFamily[] = ["inter", "playfair", "poppins", "dm-sans"];
const LAYOUTS: MediaKitLayout[] = ["minimal", "bold", "elegant"];

const layoutThumbnailStyles: Record<MediaKitLayout, string> = {
  minimal: "bg-white",
  bold: "bg-charcoal-900",
  elegant: "bg-cream-50",
};

export function ThemeSection() {
  const draft = useEditorStore((state) => state.draft);
  const updateField = useEditorStore((state) => state.updateField);

  function selectLayout(layout: MediaKitLayout) {
    updateField("theme.layout", layout);
    const preset = layoutDefaultColors[layout];
    updateField("theme.primaryColor", preset.primaryColor);
    updateField("theme.backgroundColor", preset.backgroundColor);
  }

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="primaryColor">Primary color</Label>
          <input
            id="primaryColor"
            type="color"
            value={draft.theme.primaryColor}
            onChange={(e) => updateField("theme.primaryColor", e.target.value)}
            className="h-10 w-full cursor-pointer rounded-md border border-cream-200"
          />
        </div>
        <div>
          <Label htmlFor="backgroundColor">Background color</Label>
          <input
            id="backgroundColor"
            type="color"
            value={draft.theme.backgroundColor}
            onChange={(e) => updateField("theme.backgroundColor", e.target.value)}
            className="h-10 w-full cursor-pointer rounded-md border border-cream-200"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="fontFamily">Font</Label>
        <Select
          id="fontFamily"
          value={draft.theme.fontFamily}
          onChange={(e) => updateField("theme.fontFamily", e.target.value)}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font}>
              {fontFamilyLabels[font]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Layout</Label>
        <div className="grid grid-cols-3 gap-3">
          {LAYOUTS.map((layout) => (
            <button
              key={layout}
              type="button"
              onClick={() => selectLayout(layout)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-md border p-2 transition-colors",
                draft.theme.layout === layout
                  ? "border-mauve-400 ring-1 ring-mauve-400"
                  : "border-cream-200 hover:border-mauve-200"
              )}
            >
              <span
                className={cn(
                  "h-12 w-full rounded",
                  layoutThumbnailStyles[layout],
                  layout === "bold" ? "border border-charcoal-900" : "border border-cream-200"
                )}
              />
              <span className="text-xs font-medium text-charcoal-600">{layoutLabels[layout]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
