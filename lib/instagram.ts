import { Timestamp } from "firebase-admin/firestore";

const SHORT_LIVED_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const GRAPH_BASE_URL = "https://graph.instagram.com";
const TOKEN_EXPIRING_SOON_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface InstagramProfile {
  id: string;
  username: string;
  profileImageUrl: string;
  followerCount: number;
  biography: string;
}

export interface InstagramTokenResult {
  accessToken: string;
  tokenExpiresAt: Timestamp;
}

/** Shape of the private token doc at mediaKits/{id}/private/instagram — server-only, never exposed to clients. */
export interface InstagramTokenDoc {
  accessToken: string;
  tokenExpiresAt: Timestamp;
  connectedAt: Timestamp;
}

export const INSTAGRAM_PRIVATE_SUBCOLLECTION = "private";
export const INSTAGRAM_PRIVATE_DOC_ID = "instagram";
export const INSTAGRAM_OAUTH_STATE_COOKIE = "ig_oauth_state";

interface ShortLivedTokenResponse {
  access_token: string;
  user_id: string;
}

interface LongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // seconds
}

interface InstagramProfileResponse {
  id: string;
  username: string;
  profile_picture_url?: string;
  followers_count?: number;
  biography?: string;
}

/** Exchanges the OAuth `code` from the callback redirect for a short-lived (1 hour) access token. */
export async function exchangeCodeForShortLivedToken(code: string): Promise<ShortLivedTokenResponse> {
  const body = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID ?? "",
    client_secret: process.env.INSTAGRAM_APP_SECRET ?? "",
    grant_type: "authorization_code",
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI ?? "",
    code,
  });

  const response = await fetch(SHORT_LIVED_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(`Instagram short-lived token exchange failed: ${response.status}`);
  }

  return response.json();
}

/** Exchanges a short-lived token for a long-lived (60 day) access token. */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<InstagramTokenResult> {
  const url = new URL(`${GRAPH_BASE_URL}/access_token`);
  url.searchParams.set("grant_type", "ig_exchange_token");
  url.searchParams.set("client_secret", process.env.INSTAGRAM_APP_SECRET ?? "");
  url.searchParams.set("access_token", shortLivedToken);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Instagram long-lived token exchange failed: ${response.status}`);
  }

  const data: LongLivedTokenResponse = await response.json();
  return {
    accessToken: data.access_token,
    tokenExpiresAt: Timestamp.fromMillis(Date.now() + data.expires_in * 1000),
  };
}

/** Fetches the connected account's profile data. */
export async function getInstagramProfile(accessToken: string): Promise<InstagramProfile> {
  const url = new URL(`${GRAPH_BASE_URL}/me`);
  url.searchParams.set("fields", "id,username,profile_picture_url,followers_count,biography");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Instagram profile fetch failed: ${response.status}`);
  }

  const data: InstagramProfileResponse = await response.json();
  return {
    id: data.id,
    username: data.username,
    profileImageUrl: data.profile_picture_url ?? "",
    followerCount: data.followers_count ?? 0,
    biography: data.biography ?? "",
  };
}

/** Refreshes a long-lived token before it expires, extending it another 60 days. */
export async function refreshInstagramToken(accessToken: string): Promise<InstagramTokenResult> {
  const url = new URL(`${GRAPH_BASE_URL}/refresh_access_token`);
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Instagram token refresh failed: ${response.status}`);
  }

  const data: LongLivedTokenResponse = await response.json();
  return {
    accessToken: data.access_token,
    tokenExpiresAt: Timestamp.fromMillis(Date.now() + data.expires_in * 1000),
  };
}

/** True if the token expires within the next 7 days (or has already expired). */
export function isTokenExpiringSoon(tokenExpiresAt: Timestamp): boolean {
  return tokenExpiresAt.toMillis() - Date.now() < TOKEN_EXPIRING_SOON_MS;
}
