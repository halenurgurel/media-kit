import type { MediaKitFontFamily, MediaKitLayout } from "@/types/mediakit";

export const fontFamilyClassNames: Record<MediaKitFontFamily, string> = {
  inter: "font-sans",
  playfair: "font-display",
  poppins: "font-poppins",
  "dm-sans": "font-dm",
};

export const fontFamilyLabels: Record<MediaKitFontFamily, string> = {
  inter: "Inter",
  playfair: "Playfair Display",
  poppins: "Poppins",
  "dm-sans": "DM Sans",
};

export const layoutLabels: Record<MediaKitLayout, string> = {
  minimal: "Minimal",
  bold: "Bold",
  elegant: "Elegant",
};
