import { NextResponse, type NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import {
  getInstagramProfile,
  isTokenExpiringSoon,
  refreshInstagramToken,
  INSTAGRAM_PRIVATE_SUBCOLLECTION,
  INSTAGRAM_PRIVATE_DOC_ID,
  type InstagramTokenDoc,
} from "@/lib/instagram";

const MEDIA_KITS_COLLECTION = "mediaKits";

async function requireUid(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization") ?? "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
  if (!idToken) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    return null;
  }
}

function tokenRefFor(uid: string) {
  return adminDb
    .collection(MEDIA_KITS_COLLECTION)
    .doc(uid)
    .collection(INSTAGRAM_PRIVATE_SUBCOLLECTION)
    .doc(INSTAGRAM_PRIVATE_DOC_ID);
}

/** Read-only status check — used to show the "expires soon" banner without mutating anything. */
export async function GET(request: NextRequest) {
  const uid = await requireUid(request);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await tokenRefFor(uid).get();
  const tokenDoc = snapshot.data() as InstagramTokenDoc | undefined;

  if (!tokenDoc) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({
    connected: true,
    tokenExpiresAt: tokenDoc.tokenExpiresAt.toDate().toISOString(),
    expiringSoon: isTokenExpiringSoon(tokenDoc.tokenExpiresAt),
  });
}

/** Refreshes the access token if it's expiring soon, then re-fetches the profile and syncs it onto the public media kit doc. */
export async function POST(request: NextRequest) {
  const uid = await requireUid(request);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokenRef = tokenRefFor(uid);
  const snapshot = await tokenRef.get();
  const tokenDoc = snapshot.data() as InstagramTokenDoc | undefined;

  if (!tokenDoc) {
    return NextResponse.json({ error: "No Instagram account connected." }, { status: 404 });
  }

  try {
    let accessToken = tokenDoc.accessToken;
    let tokenExpiresAt = tokenDoc.tokenExpiresAt;

    if (isTokenExpiringSoon(tokenExpiresAt)) {
      const refreshed = await refreshInstagramToken(accessToken);
      accessToken = refreshed.accessToken;
      tokenExpiresAt = refreshed.tokenExpiresAt;
      await tokenRef.set({ accessToken, tokenExpiresAt }, { merge: true });
    }

    const profile = await getInstagramProfile(accessToken);

    const instagram = {
      username: profile.username,
      profileImageUrl: profile.profileImageUrl,
      followerCount: profile.followerCount,
      biography: profile.biography,
    };

    await adminDb
      .collection(MEDIA_KITS_COLLECTION)
      .doc(uid)
      .set({ instagram }, { merge: true });

    return NextResponse.json({ instagram, tokenExpiresAt: tokenExpiresAt.toDate().toISOString() });
  } catch (error) {
    console.error("Instagram sync failed:", error);
    return NextResponse.json({ error: "Failed to sync your Instagram account." }, { status: 502 });
  }
}
