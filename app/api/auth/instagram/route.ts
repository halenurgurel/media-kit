import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { INSTAGRAM_OAUTH_STATE_COOKIE } from "@/lib/instagram";

const AUTHORIZE_URL = "https://www.instagram.com/oauth/authorize";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("__session")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login?redirect=/editor", request.url));
  }

  try {
    await adminAuth.verifyIdToken(sessionToken);
  } catch {
    return NextResponse.redirect(new URL("/login?redirect=/editor", request.url));
  }

  const state = randomUUID();

  const authorizeUrl = new URL(AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", process.env.INSTAGRAM_APP_ID ?? "");
  authorizeUrl.searchParams.set("redirect_uri", process.env.INSTAGRAM_REDIRECT_URI ?? "");
  authorizeUrl.searchParams.set("scope", "instagram_business_basic");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(INSTAGRAM_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/api/auth/instagram",
  });

  return response;
}
