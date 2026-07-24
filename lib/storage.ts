import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFile(
  path: string,
  file: File | Blob,
  metadata?: UploadMetadata
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  return uploadFile(`avatars/${userId}/${file.name}`, file);
}

export async function uploadCoverImage(userId: string, file: File): Promise<string> {
  return uploadFile(`covers/${userId}/${file.name}`, file);
}

export async function uploadCollaborationImage(
  userId: string,
  collaborationId: string,
  file: File
): Promise<string> {
  return uploadFile(`collaborations/${userId}/${collaborationId}/${file.name}`, file);
}

export async function deleteFile(path: string): Promise<void> {
  await deleteObject(ref(storage, path));
}
