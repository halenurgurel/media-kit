import type { Collaboration } from "@/types/mediakit";

interface CollaborationGridProps {
  collaborations: Collaboration[];
}

export function CollaborationGrid({ collaborations }: CollaborationGridProps) {
  if (collaborations.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-center text-xl font-semibold text-[color:var(--theme-text)]">
        Past Collaborations
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {collaborations.map((collab) => (
          <div
            key={collab.id}
            className="flex items-start gap-4 rounded-lg border border-[color:var(--theme-accent-light)] p-4"
          >
            {collab.brandLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={collab.brandLogoUrl}
                alt={collab.brandName}
                className="h-12 w-12 shrink-0 rounded-md object-cover"
              />
            ) : (
              <div className="h-12 w-12 shrink-0 rounded-md bg-[color:var(--theme-accent-light)]" />
            )}
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[color:var(--theme-text)]">
                  {collab.brandName}
                </span>
                {collab.date && (
                  <span className="text-xs text-[color:var(--theme-muted)]">{collab.date}</span>
                )}
              </div>
              {collab.description && (
                <p className="text-sm text-[color:var(--theme-muted)]">{collab.description}</p>
              )}
              {collab.resultMetric && (
                <span className="mt-1 inline-block w-fit rounded-full bg-[color:var(--theme-accent-light)] px-2.5 py-1 text-xs font-medium text-[color:var(--theme-accent)]">
                  {collab.resultMetric}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
