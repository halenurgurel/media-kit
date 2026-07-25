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

export interface ColorPalette {
  name: string;
  primaryColor: string;
  backgroundColor: string;
}

// Curated one-click color pairings for users who don't want to pick colors by hand.
export const colorPalettes: ColorPalette[] = [
  { name: "Classic Mauve", primaryColor: "#B08BA8", backgroundColor: "#FFFFFF" },
  { name: "Blush", primaryColor: "#E8A0A0", backgroundColor: "#FDF6F0" },
  { name: "Charcoal Noir", primaryColor: "#D14D6C", backgroundColor: "#1C1410" },
  { name: "Sage", primaryColor: "#7A9471", backgroundColor: "#F6F7F2" },
  { name: "Ocean", primaryColor: "#3E7CB1", backgroundColor: "#F3F8FB" },
  { name: "Sunset", primaryColor: "#E8873A", backgroundColor: "#FFF8F0" },
  { name: "Golden", primaryColor: "#C9962C", backgroundColor: "#1A1A1A" },
  { name: "Lavender", primaryColor: "#9B87C4", backgroundColor: "#FAF8FD" },
];
