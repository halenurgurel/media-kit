function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((c) => c + c).join("")
    : normalized;
  const int = parseInt(value, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

/** Blends hexA into hexB, weighted by `ratio` (0 = pure hexB, 1 = pure hexA). */
function mixHexColors(hexA: string, hexB: string, ratio: number): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex([
    a[0] * ratio + b[0] * (1 - ratio),
    a[1] * ratio + b[1] * (1 - ratio),
    a[2] * ratio + b[2] * (1 - ratio),
  ]);
}

/** Derives a muted "accent-light" tint (badge/track backgrounds, section
 * backgrounds) from the user's chosen primary and background colors, so
 * custom theme colors flow through instead of a hardcoded layout preset. */
export function getAccentLightColor(primaryColor: string, backgroundColor: string): string {
  return mixHexColors(primaryColor, backgroundColor, 0.2);
}
