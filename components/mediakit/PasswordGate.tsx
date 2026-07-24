"use client";

import { useState, type FormEvent } from "react";
import { verifyMediaKitPassword } from "@/lib/actions/mediakit.actions";
import { MediaKitPreview } from "./MediaKitPreview";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import type { PublicMediaKit } from "@/types/mediakit";

interface PasswordGateProps {
  username: string;
  displayName: string;
}

export function PasswordGate({ username, displayName }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unlockedMediaKit, setUnlockedMediaKit] = useState<PublicMediaKit | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await verifyMediaKitPassword(username, password);
      if (result.ok) {
        setUnlockedMediaKit(result.mediaKit);
      } else {
        setError("That password isn't correct.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (unlockedMediaKit) {
    return <MediaKitPreview draft={unlockedMediaKit} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 p-8">
      <div className="w-full max-w-sm rounded-lg border border-cream-200 bg-white p-8 text-center">
        <h1 className="text-lg font-semibold text-charcoal-900">
          {displayName ? `${displayName}'s media kit is protected` : "This media kit is protected"}
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">Enter the password to view it.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 text-left">
          <div>
            <Label htmlFor="gate-password">Password</Label>
            <Input
              id="gate-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting || !password}>
            {isSubmitting ? "Checking..." : "View media kit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
