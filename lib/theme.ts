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

// Matches the [data-theme] palettes in globals.css (and generateMediaKitPDF.tsx) so
// that switching layouts actually switches background/accent — otherwise a
// leftover custom primaryColor/backgroundColor (e.g. white) would silently
// override the layout's intended palette and make text unreadable.
export const layoutDefaultColors: Record<MediaKitLayout, { primaryColor: string; backgroundColor: string }> = {
  minimal: { primaryColor: "#B08BA8", backgroundColor: "#FFFFFF" },
  bold: { primaryColor: "#D14D6C", backgroundColor: "#1C1410" },
  elegant: { primaryColor: "#B08BA8", backgroundColor: "#FAF7F4" },
};
