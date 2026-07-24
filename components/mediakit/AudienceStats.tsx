import type { CreatorStats, Platform } from "@/types/mediakit";
import { averageEngagementRate } from "@/lib/mediakit";
import { parseDemographicSegments } from "@/lib/demographics";

interface AudienceStatsProps {
  stats: CreatorStats;
  platforms: Platform[];
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
}

const demographicRows: { key: "audienceLocation" | "audienceAge" | "audienceGender"; label: string }[] = [
  { key: "audienceLocation", label: "Top locations" },
  { key: "audienceAge", label: "Age range" },
  { key: "audienceGender", label: "Gender split" },
];

export function AudienceStats({ stats, platforms }: AudienceStatsProps) {
  const engagementRate = averageEngagementRate(platforms);

  const statCards = [
    { label: "Avg. likes", value: formatCount(stats.avgLikes) },
    { label: "Avg. comments", value: formatCount(stats.avgComments) },
    { label: "Engagement rate", value: `${engagementRate.toFixed(1)}%` },
    { label: "Monthly impressions", value: formatCount(stats.monthlyImpressions) },
  ];

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-center text-xl font-semibold text-[color:var(--theme-text)]">
        Audience &amp; Performance
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-[color:var(--theme-accent-light)] p-4 text-center"
          >
            <span className="block text-2xl font-bold text-[color:var(--theme-text)]">
              {card.value}
            </span>
            <span className="mt-1 block text-xs uppercase tracking-wide text-[color:var(--theme-muted)]">
              {card.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {demographicRows.map(({ key, label }) => {
          const raw = stats[key];
          const segments = parseDemographicSegments(raw);
          return (
            <div key={key}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--theme-muted)]">
                {label}
              </h3>
              {segments.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {segments.map((segment) => (
                    <div key={segment.label}>
                      <div className="mb-1 flex items-center justify-between text-xs text-[color:var(--theme-text)]">
                        <span>{segment.label}</span>
                        <span className="font-medium">{segment.percent}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[color:var(--theme-accent-light)]">
                        <div
                          className="h-2 rounded-full bg-[color:var(--theme-accent)]"
                          style={{ width: `${segment.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                raw && <p className="text-sm text-[color:var(--theme-text)]">{raw}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
