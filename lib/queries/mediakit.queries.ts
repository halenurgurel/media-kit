import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MEDIA_KITS_COLLECTION, changeUsername } from "@/lib/firestore";
import { useEditorStore } from "@/store/useEditorStore";
import { useToastStore } from "@/store/useToastStore";
import type { MediaKit } from "@/types/mediakit";

export const mediaKitKeys = {
  detail: (userId: string) => ["mediakit", userId] as const,
};

async function fetchMediaKit(userId: string): Promise<MediaKit | null> {
  const snapshot = await getDoc(doc(db, MEDIA_KITS_COLLECTION, userId));
  return snapshot.exists() ? (snapshot.data() as MediaKit) : null;
}

export function useMediaKit(userId: string) {
  const resetDraft = useEditorStore((state) => state.resetDraft);

  const query = useQuery({
    queryKey: mediaKitKeys.detail(userId),
    queryFn: () => fetchMediaKit(userId),
    enabled: Boolean(userId),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) {
      resetDraft(query.data);
    }
  }, [query.data, resetDraft]);

  return query;
}

export function useSaveMediaKit() {
  const queryClient = useQueryClient();
  const resetDraft = useEditorStore((state) => state.resetDraft);
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: async (draft: MediaKit) => {
      await setDoc(doc(db, MEDIA_KITS_COLLECTION, draft.userId), {
        ...draft,
        updatedAt: serverTimestamp(),
      });
      return draft;
    },
    onSuccess: (savedDraft) => {
      resetDraft(savedDraft);
      queryClient.setQueryData(mediaKitKeys.detail(savedDraft.userId), savedDraft);
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : "Failed to save your media kit.", "error");
    },
  });
}

export function useChangeUsername() {
  const queryClient = useQueryClient();
  const resetDraft = useEditorStore((state) => state.resetDraft);
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: async ({
      uid,
      oldUsername,
      newUsername,
    }: {
      uid: string;
      oldUsername: string;
      newUsername: string;
    }) => {
      await changeUsername(uid, oldUsername, newUsername);
      return newUsername;
    },
    onSuccess: (newUsername) => {
      // The username is already persisted by changeUsername, so sync the draft
      // via resetDraft (not updateField) to avoid flagging it as unsaved.
      const latestDraft = useEditorStore.getState().draft;
      const updatedDraft = { ...latestDraft, username: newUsername };
      resetDraft(updatedDraft);
      queryClient.setQueryData<MediaKit | null>(mediaKitKeys.detail(updatedDraft.userId), () => updatedDraft);
      showToast("Username updated.", "success");
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : "Failed to update username.", "error");
    },
  });
}
