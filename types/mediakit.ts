/**
 * Core TypeScript interfaces for the Media Kit Builder app.
 */

import type { Timestamp } from "firebase/firestore";

export type PlatformName = "instagram" | "tiktok" | "youtube" | "twitter";

export interface Platform {
  name: PlatformName;
  handle: string;
  followerCount: number;
  engagementRate: number;
}

export interface CreatorStats {
  avgLikes: number;
  avgComments: number;
  avgReach: number;
  monthlyImpressions: number;
  audienceLocation: string;
  audienceAge: string;
  audienceGender: string;
}

/** Public-safe Instagram connection info, readable wherever the media kit itself is readable.
 * The access token is intentionally excluded — it lives in the private `instagram` doc under
 * mediaKits/{id}/private, which only the server (Firebase Admin SDK) can read. */
export interface InstagramConnection {
  username: string;
  profileImageUrl: string;
  followerCount: number;
  biography: string;
  connectedAt: Timestamp;
}

export interface Collaboration {
  id: string;
  brandName: string;
  brandLogoUrl?: string;
  description: string;
  resultMetric: string;
  date: string;
  postUrl?: string;
}

export type ServiceCurrency = "USD" | "EUR" | "TRY";

export interface Service {
  id: string;
  name: string;
  price: number;
  currency: ServiceCurrency;
  isHidden: boolean;
}

export type MediaKitFontFamily = "inter" | "playfair" | "poppins" | "dm-sans";
export type MediaKitLayout = "minimal" | "bold" | "elegant";

export interface MediaKitTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: MediaKitFontFamily;
  layout: MediaKitLayout;
}

export interface MediaKit {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  profileImageUrl: string;
  niche: string[];
  platforms: Platform[];
  stats: CreatorStats;
  collaborations: Collaboration[];
  services: Service[];
  theme: MediaKitTheme;
  contactEmail?: string;
  isPublished: boolean;
  passwordProtected: boolean;
  password?: string;
  instagram?: InstagramConnection;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  username?: string;
  mediaKitId?: string;
  createdAt: Timestamp;
}

/** MediaKit without server Timestamp fields — used wherever data may cross a
 * server-action/client serialization boundary (e.g. the password gate). */
export type PublicMediaKit = Omit<MediaKit, "createdAt" | "updatedAt">;

export type EditorSectionId =
  | "profile"
  | "platforms"
  | "stats"
  | "collaborations"
  | "services"
  | "theme"
  | "settings";
