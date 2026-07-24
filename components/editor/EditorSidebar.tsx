"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { cn } from "@/lib/utils";
import type { EditorSectionId } from "@/types/mediakit";

const sections: { id: EditorSectionId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "platforms", label: "Platforms" },
  { id: "stats", label: "Stats" },
  { id: "collaborations", label: "Collaborations" },
  { id: "services", label: "Services" },
  { id: "theme", label: "Theme" },
  { id: "settings", label: "Settings" },
];

export function EditorSidebar() {
  const activeSection = useEditorStore((state) => state.activeSection);
  const setActiveSection = useEditorStore((state) => state.setActiveSection);

  return (
    <nav className="flex flex-wrap gap-1 border-b border-cream-200 pb-3">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={cn(
            "rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
            activeSection === section.id
              ? "bg-mauve-400 text-white"
              : "text-charcoal-600 hover:bg-cream-100"
          )}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
