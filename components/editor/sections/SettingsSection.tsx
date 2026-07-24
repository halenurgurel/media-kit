"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/useToastStore";

export function SettingsSection() {
  const draft = useEditorStore((state) => state.draft);
  const updateField = useEditorStore((state) => state.updateField);
  const showToast = useToastStore((state) => state.showToast);
  const [copied, setCopied] = useState(false);

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : "https://site.com"}/${draft.username}`;

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Couldn't copy the link.", "error");
    }
  }

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div className="flex items-center justify-between rounded-md border border-cream-200 bg-white p-4">
        <div>
          <p className="text-sm font-medium text-charcoal-900">Published</p>
          <p className="text-xs text-charcoal-600">Make your media kit visible at your public URL.</p>
        </div>
        <Toggle
          checked={draft.isPublished}
          onChange={(e) => updateField("isPublished", e.target.checked)}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-cream-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal-900">Password protection</p>
            <p className="text-xs text-charcoal-600">Require a password before visitors can view your public page.</p>
          </div>
          <Toggle
            checked={draft.passwordProtected}
            onChange={(e) => updateField("passwordProtected", e.target.checked)}
          />
        </div>
        {draft.passwordProtected && (
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="text"
              value={draft.password ?? ""}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="contactEmail">Contact email</Label>
        <Input
          id="contactEmail"
          type="email"
          placeholder="you@example.com"
          value={draft.contactEmail ?? ""}
          onChange={(e) => updateField("contactEmail", e.target.value)}
        />
        <p className="mt-1 text-xs text-charcoal-600">
          Shown as a &quot;Work with me&quot; button on your public page.
        </p>
      </div>

      <div>
        <Label>Public URL</Label>
        <div className="flex gap-2">
          <Input value={publicUrl} readOnly />
          <Button type="button" variant="secondary" onClick={copyUrl}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}
