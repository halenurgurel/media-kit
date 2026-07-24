import { create } from "zustand";
import { setPath } from "@/lib/objectPath";
import { createEmptyMediaKit, defaultTheme } from "@/lib/mediakit";
import type { EditorSectionId, MediaKit } from "@/types/mediakit";

interface EditorState {
  draft: MediaKit;
  isDirty: boolean;
  activeSection: EditorSectionId;

  setDraft: (draft: MediaKit) => void;
  updateField: (path: string, value: unknown) => void;
  resetDraft: (saved: MediaKit) => void;
  setActiveSection: (section: EditorSectionId) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  draft: createEmptyMediaKit(),
  isDirty: false,
  activeSection: "profile",

  setDraft: (draft) => set({ draft, isDirty: true }),

  updateField: (path, value) =>
    set((state) => ({ draft: setPath(state.draft, path, value), isDirty: true })),

  resetDraft: (saved) => set({ draft: saved, isDirty: false }),

  setActiveSection: (activeSection) => set({ activeSection }),
}));

export { defaultTheme };
