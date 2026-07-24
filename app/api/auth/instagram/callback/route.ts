import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import {
  exchangeCodeForShortLivedToken,
  exchangeForLongLivedToken,
  getInstagramProfile,
  INSTAGRAM_PRIVATE_SUBCOLLECTION,
  INSTAGRAM_PRIVATE_DOC_ID,
  INSTAGRAM_OAUTH_STATE_COOKIE,
} from "@/lib/instagram";

const MEDIA_KITS_COLLECTION = "mediaKits";

function failureRedirect(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL("/editor?error=instagram_auth_failed", request.url));
  response.cookies.delete(INSTAGRAM_OAUTH_STATE_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const expectedState = request.cookies.get(INSTAGRAM_OAUTH_STATE_COOKIE)?.value;
  const sessionToken = request.cookies.get("__session")?.value;

  if (error || !code || !state || !expectedState || state !== expectedState || !sessionToken) {
    return failureRedirect(request);
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(sessionToken);
    uid = decoded.uid;
  } catch {
    return failureRedirect(request);
  }

  try {
    const shortLived = await exchangeCodeForShortLivedToken(code);
    const longLived = await exchangeForLongLivedToken(shortLived.access_token);
    const profile = await getInstagramProfile(longLived.accessToken);

    const connectedAt = FieldValue.serverTimestamp();
    const mediaKitRef = adminDb.collection(MEDIA_KITS_COLLECTION).doc(uid);

    await Promise.all([
      mediaKitRef.set(
        {
          instagram: {
            username: profile.username,
            profileImageUrl: profile.profileImageUrl,
            followerCount: profile.followerCount,
            biography: profile.biography,
            connectedAt,
          },
          updatedAt: connectedAt,
        },
        { merge: true }
      ),
      mediaKitRef
        .collection(INSTAGRAM_PRIVATE_SUBCOLLECTION)
        .doc(INSTAGRAM_PRIVATE_DOC_ID)
        .set({
          accessToken: longLived.accessToken,
          tokenExpiresAt: longLived.tokenExpiresAt,
          connectedAt,
        }),
    ]);
  } catch (err) {
    console.error("Instagram OAuth callback failed:", err);
    return failureRedirect(request);
  }

  const response = NextResponse.redirect(new URL("/editor", request.url));
  response.cookies.delete(INSTAGRAM_OAUTH_STATE_COOKIE);
  return response;
}
