"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEditorStore } from "@/store/useEditorStore";
import { useMediaKit, useSaveMediaKit } from "@/lib/queries/mediakit.queries";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { MediaKitPreview } from "@/components/mediakit/MediaKitPreview";
import { ProfileSection } from "@/components/editor/sections/ProfileSection";
import { PlatformsSection } from "@/components/editor/sections/PlatformsSection";
import { StatsSection } from "@/components/editor/sections/StatsSection";
import { CollaborationsSection } from "@/components/editor/sections/CollaborationsSection";
import { ServicesSection } from "@/components/editor/sections/ServicesSection";
import { ThemeSection } from "@/components/editor/sections/ThemeSection";
import { SettingsSection } from "@/components/editor/sections/SettingsSection";
import type { EditorSectionId } from "@/types/mediakit";

const AUTO_SAVE_DELAY_MS = 60_000;

const sectionComponents: Record<EditorSectionId, () => JSX.Element> = {
  profile: ProfileSection,
  platforms: PlatformsSection,
  stats: StatsSection,
  collaborations: CollaborationsSection,
  services: ServicesSection,
  theme: ThemeSection,
  settings: SettingsSection,
};

export default function EditorPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);

  const draft = useEditorStore((state) => state.draft);
  const isDirty = useEditorStore((state) => state.isDirty);
  const activeSection = useEditorStore((state) => state.activeSection);

  const { isLoading: mediaKitLoading } = useMediaKit(user?.uid ?? "");
  const saveMediaKit = useSaveMediaKit();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/editor");
    }
  }, [authLoading, user, router]);

  // Auto-save 60s after the draft becomes dirty; re-reads the freshest
  // draft from the store when the timer fires rather than closing over it.
  useEffect(() => {
    if (!isDirty) return;
    const timeout = setTimeout(() => {
      const latestDraft = useEditorStore.getState().draft;
      saveMediaKit.mutate(latestDraft);
    }, AUTO_SAVE_DELAY_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-charcoal-600">
        Loading...
      </div>
    );
  }

  const ActiveSectionComponent = sectionComponents[activeSection];

  return (
    <div className="flex min-h-screen flex-col bg-cream-50 md:h-screen md:overflow-hidden">
      <EditorHeader />

      {mediaKitLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-charcoal-600">
          Loading your media kit...
        </div>
      ) : (
        <main className="flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
          <section className="flex w-full flex-col gap-6 overflow-y-auto border-b border-cream-200 p-4 sm:p-6 md:w-[40%] md:border-b-0 md:border-r">
            <EditorSidebar />
            <ActiveSectionComponent />
          </section>

          <section className="w-full md:w-[60%] md:overflow-y-auto">
            <MediaKitPreview draft={draft} />
          </section>
        </main>
      )}
    </div>
  );
}
