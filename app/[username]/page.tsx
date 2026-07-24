import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMediaKitByUsername } from "@/lib/firestore";
import { MediaKitPreview } from "@/components/mediakit/MediaKitPreview";
import { PasswordGate } from "@/components/mediakit/PasswordGate";

interface PublicMediaKitPageProps {
  params: { username: string };
}

// Deduped per-request so generateMetadata and the page component share one
// Firestore read instead of issuing it twice.
const getCachedMediaKit = cache((username: string) => getMediaKitByUsername(username));

export async function generateMetadata({ params }: PublicMediaKitPageProps): Promise<Metadata> {
  const mediaKit = await getCachedMediaKit(params.username);
  if (!mediaKit) {
    return { title: "Media kit not found" };
  }

  const title = `${mediaKit.displayName} | Media Kit`;
  const description = mediaKit.bio || `${mediaKit.displayName}'s media kit`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: mediaKit.profileImageUrl ? [{ url: mediaKit.profileImageUrl }] : undefined,
    },
  };
}

export default async function PublicMediaKitPage({ params }: PublicMediaKitPageProps) {
  const mediaKit = await getCachedMediaKit(params.username);

  if (!mediaKit) {
    notFound();
  }

  if (mediaKit.passwordProtected) {
    return <PasswordGate username={params.username} displayName={mediaKit.displayName} />;
  }

  return <MediaKitPreview draft={mediaKit} />;
}
