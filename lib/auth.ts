import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { auth } from "./firebase";
import { createMediaKit, isUsernameTaken, reserveUsername, upsertUserProfile } from "./firestore";
import { createEmptyMediaKit } from "./mediakit";

export async function signUpWithEmail(
  email: string,
  password: string,
  username: string
): Promise<FirebaseUser> {
  const taken = await isUsernameTaken(username);
  if (taken) {
    throw new Error("This username is already taken.");
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  const now = serverTimestamp() as unknown as Timestamp;

  try {
    // Authoritative claim: the security rules reject this write if another
    // signup reserved the same username in the meantime, closing the race
    // the pre-check above can't fully rule out.
    await reserveUsername(username, uid);
  } catch {
    // Roll back the auth account so a retry with a different username isn't
    // blocked by "email already in use".
    await credential.user.delete().catch(() => {});
    throw new Error("This username was just taken. Please choose another and try again.");
  }

  await upsertUserProfile({
    uid,
    email,
    username,
    mediaKitId: uid,
    createdAt: now,
  });

  await createMediaKit({
    ...createEmptyMediaKit(uid, username),
    createdAt: now,
    updatedAt: now,
  });

  return credential.user;
}

export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}
