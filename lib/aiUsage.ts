import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebaseAdmin";

export const DAILY_BIO_GENERATION_LIMIT = 5;
export const AI_USAGE_COLLECTION = "aiUsage";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

interface UsageDoc {
  date?: string;
  count?: number;
}

export interface UsageResult {
  allowed: boolean;
  remaining: number;
}

/** Reads today's usage without consuming a generation. */
export async function getBioGenerationUsage(uid: string): Promise<UsageResult> {
  const snapshot = await adminDb.collection(AI_USAGE_COLLECTION).doc(uid).get();
  const data = snapshot.data() as UsageDoc | undefined;
  const count = data?.date === todayKey() ? (data.count ?? 0) : 0;
  return { allowed: count < DAILY_BIO_GENERATION_LIMIT, remaining: Math.max(0, DAILY_BIO_GENERATION_LIMIT - count) };
}

/** Atomically checks and consumes one of today's generations. Resets the counter on a new day. */
export async function consumeBioGeneration(uid: string): Promise<UsageResult> {
  const ref = adminDb.collection(AI_USAGE_COLLECTION).doc(uid);
  const today = todayKey();

  return adminDb.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    const data = snapshot.data() as UsageDoc | undefined;
    const count = data?.date === today ? (data.count ?? 0) : 0;

    if (count >= DAILY_BIO_GENERATION_LIMIT) {
      return { allowed: false, remaining: 0 };
    }

    tx.set(ref, { date: today, count: count + 1, updatedAt: FieldValue.serverTimestamp() });
    return { allowed: true, remaining: DAILY_BIO_GENERATION_LIMIT - (count + 1) };
  });
}
