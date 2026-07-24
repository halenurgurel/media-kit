"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEditorStore } from "@/store/useEditorStore";
import { useToastStore } from "@/store/useToastStore";
import { Button } from "@/components/ui/Button";
import type { Platform } from "@/types/mediakit";

interface StatusResponse {
  connected: boolean;
  tokenExpiresAt?: string;
  expiringSoon?: boolean;
}

interface SyncResponse {
  instagram: {
    username: string;
    profileImageUrl: string;
    followerCount: number;
    biography: string;
  };
  tokenExpiresAt: string;
}

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
}

function withInstagramPlatform(platforms: Platform[], handle: string, followerCount: number): Platform[] {
  const existingIndex = platforms.findIndex((p) => p.name === "instagram");
  if (existingIndex >= 0) {
    const updated = [...platforms];
    updated[existingIndex] = { ...updated[existingIndex], handle, followerCount };
    return updated;
  }
  if (platforms.length === 0) {
    return [{ name: "instagram", handle, followerCount, engagementRate: 0 }];
  }
  return platforms;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function InstagramConnect() {
  const user = useAuthStore((state) => state.user);
  const draft = useEditorStore((state) => state.draft);
  const updateField = useEditorStore((state) => state.updateField);
  const resetDraft = useEditorStore((state) => state.resetDraft);
  const showToast = useToastStore((state) => state.showToast);

  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const appliedConnectionRef = useRef<string | null>(null);

  // Auto-populate empty draft fields the first time we see this connection.
  useEffect(() => {
    const instagram = draft.instagram;
    if (!instagram) return;
    if (appliedConnectionRef.current === instagram.username) return;
    appliedConnectionRef.current = instagram.username;

    let changed = false;

    if (!draft.profileImageUrl && instagram.profileImageUrl) {
      updateField("profileImageUrl", instagram.profileImageUrl);
      changed = true;
    }
    if (!draft.displayName && instagram.username) {
      updateField("displayName", instagram.username);
      changed = true;
    }
    if (draft.platforms.length === 0) {
      updateField("platforms", withInstagramPlatform(draft.platforms, instagram.username, instagram.followerCount));
      changed = true;
    }

    if (changed) {
      showToast("Instagram connected — your profile has been updated", "success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.instagram]);

  // Check token expiry status once a connection exists.
  useEffect(() => {
    if (!user || !draft.instagram) return;
    let cancelled = false;

    (async () => {
      try {
        const idToken = await user.getIdToken();
        const response = await fetch("/api/instagram/refresh", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!response.ok) return;
        const data: StatusResponse = await response.json();
        if (!cancelled) setStatus(data);
      } catch {
        // Non-critical: the expiry banner just won't show.
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, Boolean(draft.instagram)]);

  async function handleSync() {
    if (!user) return;
    setIsSyncing(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/instagram/refresh", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data: SyncResponse & { error?: string } = await response.json();

      if (!response.ok) {
        showToast(data.error ?? "Failed to sync Instagram.", "error");
        return;
      }

      updateField("instagram", { ...draft.instagram, ...data.instagram });
      updateField(
        "platforms",
        withInstagramPlatform(draft.platforms, data.instagram.username, data.instagram.followerCount)
      );

      setStatus({ connected: true, tokenExpiresAt: data.tokenExpiresAt, expiringSoon: false });
      showToast("Instagram profile synced.", "success");
    } catch {
      showToast("Failed to sync Instagram.", "error");
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleDisconnect() {
    if (!user) return;
    setIsDisconnecting(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/instagram/disconnect", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!response.ok) {
        showToast("Failed to disconnect Instagram.", "error");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { instagram, ...rest } = draft;
      resetDraft(rest);
      setStatus(null);
      appliedConnectionRef.current = null;
      showToast("Instagram disconnected.", "success");
    } catch {
      showToast("Failed to disconnect Instagram.", "error");
    } finally {
      setIsDisconnecting(false);
    }
  }

  function handleConnect() {
    window.location.href = "/api/auth/instagram";
  }

  if (!draft.instagram) {
    return (
      <Button type="button" variant="secondary" onClick={handleConnect} className="inline-flex items-center gap-2">
        <InstagramIcon className="h-4 w-4" />
        Connect Instagram
      </Button>
    );
  }

  const { instagram } = draft;
  const expiresInDays = status?.tokenExpiresAt ? daysUntil(status.tokenExpiresAt) : null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-cream-200 bg-cream-100 p-4">
      {status?.expiringSoon && (
        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-left text-xs font-medium text-yellow-800 hover:bg-yellow-100"
        >
          Your Instagram token expires soon. Click here to refresh.
        </button>
      )}

      <div className="flex items-center gap-3">
        {instagram.profileImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={instagram.profileImageUrl}
            alt={instagram.username}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-mauve-50" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-charcoal-900">
              Connected as @{instagram.username}
            </span>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-green-600" aria-hidden>
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-xs text-charcoal-600">
            {instagram.followerCount.toLocaleString()} followers
            {expiresInDays !== null && ` · Token expires in ${expiresInDays} day${expiresInDays === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? "Syncing..." : "Sync now"}
        </Button>
        <Button type="button" variant="danger" className="flex-1" onClick={handleDisconnect} disabled={isDisconnecting}>
          {isDisconnecting ? "Disconnecting..." : "Disconnect"}
        </Button>
      </div>
    </div>
  );
}
