import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { INSTAGRAM_PRIVATE_SUBCOLLECTION, INSTAGRAM_PRIVATE_DOC_ID } from "@/lib/instagram";

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

export async function POST(request: NextRequest) {
  const uid = await requireUid(request);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mediaKitRef = adminDb.collection(MEDIA_KITS_COLLECTION).doc(uid);

  try {
    await Promise.all([
      mediaKitRef.set(
        { instagram: FieldValue.delete(), updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      ),
      mediaKitRef.collection(INSTAGRAM_PRIVATE_SUBCOLLECTION).doc(INSTAGRAM_PRIVATE_DOC_ID).delete(),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Instagram disconnect failed:", error);
    return NextResponse.json({ error: "Failed to disconnect Instagram." }, { status: 500 });
  }
}
