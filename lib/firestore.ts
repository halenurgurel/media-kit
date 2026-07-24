import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { MediaKit, UserProfile } from "@/types/mediakit";

export const MEDIA_KITS_COLLECTION = "mediaKits";
export const USERS_COLLECTION = "users";
export const USERNAMES_COLLECTION = "usernames";

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export async function upsertUserProfile(profile: UserProfile): Promise<void> {
  await setDoc(doc(db, USERS_COLLECTION, profile.uid), profile, { merge: true });
}

export async function getMediaKit(id: string): Promise<MediaKit | null> {
  const snapshot = await getDoc(doc(db, MEDIA_KITS_COLLECTION, id));
  return snapshot.exists() ? (snapshot.data() as MediaKit) : null;
}

export async function getMediaKitByUsername(username: string): Promise<MediaKit | null> {
  const q = query(
    collection(db, MEDIA_KITS_COLLECTION),
    where("username", "==", username),
    where("isPublished", "==", true)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as MediaKit;
}

/** Checks the usernames index doc directly — a plain query against mediaKits can't be used here
 * because Firestore rejects any unauthenticated list query whose security rule depends on
 * document data it can't statically prove (isPublished/ownership), regardless of whether a
 * matching document actually exists. */
export async function isUsernameTaken(username: string): Promise<boolean> {
  const snapshot = await getDoc(doc(db, USERNAMES_COLLECTION, username));
  return snapshot.exists();
}

/** Atomically reserves a username for uid. Throws if it was already claimed
 * (e.g. a concurrent signup) — the security rules enforce this, not just this check. */
export async function reserveUsername(username: string, uid: string): Promise<void> {
  await setDoc(doc(db, USERNAMES_COLLECTION, username), { uid });
}

export async function createMediaKit(mediaKit: MediaKit): Promise<void> {
  await setDoc(doc(db, MEDIA_KITS_COLLECTION, mediaKit.id), mediaKit);
}

export async function updateMediaKit(
  id: string,
  updates: Partial<MediaKit>
): Promise<void> {
  await updateDoc(doc(db, MEDIA_KITS_COLLECTION, id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMediaKit(id: string): Promise<void> {
  await deleteDoc(doc(db, MEDIA_KITS_COLLECTION, id));
}
