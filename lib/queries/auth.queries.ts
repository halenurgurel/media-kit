import { useQuery } from "@tanstack/react-query";
import { isUsernameTaken } from "@/lib/firestore";

async function fetchIsUsernameAvailable(username: string): Promise<boolean> {
  const taken = await isUsernameTaken(username);
  return !taken;
}

export function useUsernameAvailability(username: string) {
  return useQuery({
    queryKey: ["username-availability", username],
    queryFn: () => fetchIsUsernameAvailable(username),
    enabled: username.length >= 3,
    staleTime: 10_000,
  });
}
