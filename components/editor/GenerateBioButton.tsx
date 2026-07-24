"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEditorStore } from "@/store/useEditorStore";
import { useToastStore } from "@/store/useToastStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Tone = "professional" | "friendly" | "bold";
type Language = "en" | "tr";
type Status = "idle" | "loading" | "result" | "error";

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "bold", label: "Bold" },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "tr", label: "Türkçe" },
];

export function GenerateBioButton() {
  const user = useAuthStore((state) => state.user);
  const draft = useEditorStore((state) => state.draft);
  const updateField = useEditorStore((state) => state.updateField);
  const showToast = useToastStore((state) => state.showToast);

  const [isOpen, setIsOpen] = useState(false);
  const [tone, setTone] = useState<Tone>("professional");
  const [language, setLanguage] = useState<Language>("en");
  const [status, setStatus] = useState<Status>("idle");
  const [bio, setBio] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !user) return;

    let cancelled = false;
    (async () => {
      try {
        const idToken = await user.getIdToken();
        const response = await fetch("/api/generate-bio", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) setRemaining(data.remaining);
      } catch {
        // Non-critical: the counter just won't show until the next successful call.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, user]);

  const hasNiche = draft.niche.length > 0;

  async function handleGenerate() {
    if (!user) {
      showToast("You must be signed in to use AI generation.", "error");
      return;
    }

    if (!hasNiche) {
      setStatus("error");
      setErrorMessage("Add at least one niche tag in the Profile tab first.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/generate-bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          niche: draft.niche,
          platforms: draft.platforms,
          tone,
          language,
          existingInstagramBio: draft.instagram?.biography,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Failed to generate a bio.");
        if (typeof data.remaining === "number") setRemaining(data.remaining);
        return;
      }

      setBio(data.bio);
      setRemaining(data.remaining);
      setStatus("result");
    } catch {
      setStatus("error");
      setErrorMessage("Failed to generate a bio. Please try again.");
    }
  }

  function handleUseThis() {
    updateField("bio", bio);
    showToast("Bio updated.", "success");
    setIsOpen(false);
    setStatus("idle");
  }

  function toggleOpen() {
    setIsOpen((open) => !open);
    if (!isOpen) {
      setStatus("idle");
      setBio("");
      setErrorMessage("");
    }
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      <Button type="button" variant="secondary" onClick={toggleOpen} className="text-mauve-800">
        Generate with AI ✨
      </Button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-80 rounded-lg border border-cream-200 bg-cream-50 p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-charcoal-900">Generate a bio</span>
            {remaining !== null && (
              <span className="text-xs text-charcoal-600">{remaining}/5 left today</span>
            )}
          </div>

          <div className="mb-3 flex gap-2">
            {TONES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTone(option.value)}
                className={cn(
                  "flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                  tone === option.value
                    ? "border-mauve-400 bg-mauve-400 text-white"
                    : "border-cream-200 bg-white text-charcoal-600 hover:bg-cream-100"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mb-3 flex gap-2">
            {LANGUAGES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLanguage(option.value)}
                className={cn(
                  "flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                  language === option.value
                    ? "border-mauve-400 bg-mauve-400 text-white"
                    : "border-cream-200 bg-white text-charcoal-600 hover:bg-cream-100"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {status === "result" ? (
            <>
              <div className="mb-3 max-h-40 overflow-y-auto rounded-md border border-cream-200 bg-cream-100 p-3 text-sm text-charcoal-900">
                {bio}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="primary" className="flex-1" onClick={handleUseThis}>
                  Use this
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={handleGenerate}
                  disabled={remaining === 0}
                >
                  Try again
                </Button>
              </div>
            </>
          ) : (
            <>
              {status === "error" && (
                <p className="mb-3 text-xs text-red-600">{errorMessage}</p>
              )}
              <Button
                type="button"
                variant="primary"
                className="w-full"
                onClick={handleGenerate}
                disabled={status === "loading" || remaining === 0 || !hasNiche}
              >
                {status === "loading"
                  ? "Generating..."
                  : remaining === 0
                    ? "Daily limit reached"
                    : !hasNiche
                      ? "Add a niche tag first"
                      : "Generate"}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
