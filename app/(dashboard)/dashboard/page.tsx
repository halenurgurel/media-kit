"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useMediaKit } from "@/lib/queries/mediakit.queries";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);

  const { data: mediaKit, isLoading: mediaKitLoading } = useMediaKit(user?.uid ?? "");

  const [isNavigating, startNavigation] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  function navigateTo(href: string) {
    setPendingHref(href);
    startNavigation(() => router.push(href));
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-charcoal-600">
        Loading...
      </div>
    );
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button
          onClick={() => navigateTo("/editor")}
          disabled={isNavigating}
        >
          {isNavigating && pendingHref === "/editor" ? "Loading..." : "Edit my media kit"}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your media kit</CardTitle>
        </CardHeader>
        <CardContent>
          {mediaKitLoading ? (
            <p className="text-sm text-gray-500">Loading your media kit...</p>
          ) : !mediaKit ? (
            <p className="text-sm text-gray-500">
              You haven&apos;t created a media kit yet. Head to the editor to get started.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-charcoal-900">
                  {mediaKit.displayName || mediaKit.username}
                </p>
                <p className="text-sm text-gray-500">@{mediaKit.username}</p>
              </div>
              <p className="text-sm text-gray-500">
                Status: {mediaKit.isPublished ? "Published" : "Draft (not public yet)"}
              </p>
              <div className="flex gap-3">
                <Button onClick={() => navigateTo("/editor")} disabled={isNavigating}>
                  {isNavigating && pendingHref === "/editor" ? "Loading..." : "Edit"}
                </Button>
                {mediaKit.isPublished && (
                  <Button
                    variant="secondary"
                    onClick={() => navigateTo(`/${mediaKit.username}`)}
                    disabled={isNavigating}
                  >
                    {isNavigating && pendingHref === `/${mediaKit.username}`
                      ? "Loading..."
                      : "View live page"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
