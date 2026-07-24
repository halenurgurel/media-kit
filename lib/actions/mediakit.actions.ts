"use server";

import { getMediaKitByUsername } from "@/lib/firestore";
import type { PublicMediaKit } from "@/types/mediakit";

type VerifyPasswordResult = { ok: true; mediaKit: PublicMediaKit } | { ok: false };

/**
 * Re-fetches the media kit server-side and checks the submitted password.
 * Nothing about the gated content (or the password itself) is sent to the
 * client until this returns ok:true, and the response omits Firestore
 * Timestamp fields since they can't cross the server-action boundary.
 */
export async function verifyMediaKitPassword(
  username: string,
  password: string
): Promise<VerifyPasswordResult> {
  const mediaKit = await getMediaKitByUsername(username);

  if (!mediaKit || !mediaKit.passwordProtected || mediaKit.password !== password) {
    return { ok: false };
  }

  const { createdAt, updatedAt, password: storedPassword, ...publicMediaKit } = mediaKit;
  void createdAt;
  void updatedAt;
  void storedPassword;

  return { ok: true, mediaKit: publicMediaKit };
}
