import type { PublicMediaKit } from "@/types/mediakit";

interface MediaKitHeroProps {
  mediaKit: PublicMediaKit;
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function MediaKitHero({ mediaKit }: MediaKitHeroProps) {
  return (
    <header className="flex flex-col items-center gap-4 text-center">
      {mediaKit.profileImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaKit.profileImageUrl}
          alt={mediaKit.displayName}
          className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
        />
      ) : (
        <div className="h-28 w-28 rounded-full bg-[color:var(--theme-accent-light)] sm:h-32 sm:w-32" />
      )}

      <div>
        <h1 className="text-3xl font-bold text-[color:var(--theme-text)] sm:text-4xl">
          {mediaKit.displayName || "Your Name"}
        </h1>
        {mediaKit.bio && (
          <p className="mx-auto mt-2 max-w-xl text-[color:var(--theme-muted)]">{mediaKit.bio}</p>
        )}
      </div>

      {mediaKit.niche.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {mediaKit.niche.map((n) => (
            <span
              key={n}
              className="rounded-full bg-[color:var(--theme-accent-light)] px-3 py-1 text-xs font-medium text-[color:var(--theme-accent)]"
            >
              {n}
            </span>
          ))}
        </div>
      )}

      {mediaKit.platforms.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          {mediaKit.platforms.map((platform) => (
            <span
              key={platform.name}
              className="flex items-center gap-1.5 rounded-full border border-[color:var(--theme-accent-light)] px-3 py-1.5 text-sm text-[color:var(--theme-text)]"
            >
              <span className="font-medium capitalize">{platform.name}</span>
              <span className="text-[color:var(--theme-muted)]">@{platform.handle}</span>
              <span className="text-[color:var(--theme-muted)]">·</span>
              <span className="font-semibold">{formatFollowers(platform.followerCount)}</span>
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
