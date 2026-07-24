export interface DemographicSegment {
  label: string;
  percent: number;
}

/**
 * Parses free-text demographic fields (e.g. "70% Turkey, 20% US",
 * "18–34 (65%)", "Female 72%") into labeled percentage bars.
 * Falls back to an empty array when no percentage is present.
 */
export function parseDemographicSegments(value: string): DemographicSegment[] {
  if (!value) return [];

  return value
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const match = segment.match(/(\d{1,3}(?:\.\d+)?)\s*%/);
      if (!match) return null;
      const percent = Math.min(100, parseFloat(match[1]));
      const label = segment.replace(match[0], "").replace(/[()]/g, "").trim() || segment;
      return { label, percent };
    })
    .filter((segment): segment is DemographicSegment => segment !== null && segment.percent > 0);
}
