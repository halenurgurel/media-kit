import { Timestamp } from "firebase/firestore";
import type { MediaKit, MediaKitTheme, Platform } from "@/types/mediakit";

export const defaultTheme: MediaKitTheme = {
  primaryColor: "#B08BA8",
  backgroundColor: "#FFFFFF",
  fontFamily: "inter",
  layout: "minimal",
};

export function createEmptyMediaKit(userId = "", username = ""): MediaKit {
  const now = Timestamp.now();
  return {
    id: userId,
    userId,
    username,
    displayName: "",
    bio: "",
    profileImageUrl: "",
    niche: [],
    platforms: [],
    stats: {
      avgLikes: 0,
      avgComments: 0,
      avgReach: 0,
      monthlyImpressions: 0,
      audienceLocation: "",
      audienceAge: "",
      audienceGender: "",
    },
    collaborations: [],
    services: [],
    theme: defaultTheme,
    contactEmail: "",
    isPublished: false,
    passwordProtected: false,
    createdAt: now,
    updatedAt: now,
  };
}

/** Mean of each platform's engagement rate, rounded to one decimal place. */
export function averageEngagementRate(platforms: Platform[]): number {
  if (platforms.length === 0) return 0;
  const total = platforms.reduce((sum, platform) => sum + platform.engagementRate, 0);
  return Math.round((total / platforms.length) * 10) / 10;
}
