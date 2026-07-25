import type { CSSProperties } from "react";
import type { PublicMediaKit } from "@/types/mediakit";
import { fontFamilyClassNames } from "@/lib/theme";
import { getAccentLightColor } from "@/lib/color";
import { cn } from "@/lib/utils";
import { MediaKitHero } from "./MediaKitHero";
import { AudienceStats } from "./AudienceStats";
import { CollaborationGrid } from "./CollaborationGrid";
import { ServicesGrid } from "./ServicesGrid";
import { ContactCTA } from "./ContactCTA";
import { MediaKitFooter } from "./MediaKitFooter";

interface MediaKitPreviewProps {
  draft: PublicMediaKit;
}

export function MediaKitPreview({ draft }: MediaKitPreviewProps) {
  const themeOverrides = {
    "--theme-bg": draft.theme.backgroundColor,
    "--theme-accent": draft.theme.primaryColor,
    "--theme-accent-light": getAccentLightColor(draft.theme.primaryColor, draft.theme.backgroundColor),
  } as CSSProperties;

  return (
    <div
      data-theme={draft.theme.layout === "minimal" ? undefined : draft.theme.layout}
      style={{ ...themeOverrides, backgroundColor: "var(--theme-bg)" }}
      className={cn("min-h-full", fontFamilyClassNames[draft.theme.fontFamily])}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-12 p-6 sm:p-8">
        <MediaKitHero mediaKit={draft} />
        <AudienceStats stats={draft.stats} platforms={draft.platforms} />
        <CollaborationGrid collaborations={draft.collaborations} />
        <ServicesGrid services={draft.services} />
        <ContactCTA displayName={draft.displayName} contactEmail={draft.contactEmail} />
      </div>
      <MediaKitFooter />
    </div>
  );
}
