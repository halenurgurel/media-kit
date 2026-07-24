"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useEditorStore } from "@/store/useEditorStore";
import { ImageUploader } from "@/components/editor/ImageUploader";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { GenerateBioButton } from "@/components/editor/GenerateBioButton";
import { InstagramConnect } from "@/components/editor/InstagramConnect";

interface ProfileFormValues {
  displayName: string;
  bio: string;
}

export function ProfileSection() {
  const draft = useEditorStore((state) => state.draft);
  const updateField = useEditorStore((state) => state.updateField);
  const [niceInput, setNicheInput] = useState("");

  const { register, watch, reset, setValue, getValues } = useForm<ProfileFormValues>({
    defaultValues: { displayName: draft.displayName, bio: draft.bio },
  });

  // Sync the form only when a different record loads (not on every keystroke,
  // since keystrokes flow the other direction via the watch subscription below).
  useEffect(() => {
    reset({ displayName: draft.displayName, bio: draft.bio });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.id]);

  // Pick up bio changes made outside the form (e.g. "Use this" from the AI generator),
  // without fighting the watch subscription below (which already keeps draft.bio in
  // sync with every keystroke, so this only fires for external updates).
  useEffect(() => {
    if (getValues("bio") !== draft.bio) {
      setValue("bio", draft.bio, { shouldDirty: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.bio]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (!name) return;
      updateField(name, values[name as keyof ProfileFormValues]);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateField]);

  function addNiche() {
    const value = niceInput.trim().toLowerCase();
    if (!value || draft.niche.includes(value)) {
      setNicheInput("");
      return;
    }
    updateField("niche", [...draft.niche, value]);
    setNicheInput("");
  }

  function removeNiche(niche: string) {
    updateField(
      "niche",
      draft.niche.filter((n) => n !== niche)
    );
  }

  return (
    <div className="flex max-w-md flex-col gap-5">
      <div>
        <Label>Instagram</Label>
        <InstagramConnect />
      </div>

      <div>
        <Label>Profile photo</Label>
        <ImageUploader
          currentImageUrl={draft.profileImageUrl}
          label="Upload profile photo"
          shape="circle"
          onUploaded={(url) => updateField("profileImageUrl", url)}
        />
      </div>

      <div>
        <Label htmlFor="displayName">Display name</Label>
        <Input id="displayName" {...register("displayName")} />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label htmlFor="bio" className="mb-0">Bio</Label>
          <GenerateBioButton />
        </div>
        <Textarea id="bio" rows={4} {...register("bio")} />
      </div>

      <div>
        <Label htmlFor="niche">Niche tags</Label>
        <div className="flex gap-2">
          <Input
            id="niche"
            value={niceInput}
            placeholder="e.g. travel"
            onChange={(e) => setNicheInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNiche();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addNiche}>
            Add
          </Button>
        </div>
        {draft.niche.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {draft.niche.map((niche) => (
              <span
                key={niche}
                className="flex items-center gap-1 rounded-full bg-mauve-50 px-3 py-1 text-xs font-medium text-mauve-800"
              >
                {niche}
                <button
                  type="button"
                  onClick={() => removeNiche(niche)}
                  className="text-mauve-600 hover:text-mauve-800"
                  aria-label={`Remove ${niche}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
