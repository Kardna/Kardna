import { useProfile } from "../context/ProfileContext";

export function useRecentlyPlayed() {
  const { profile, recordLaunch } = useProfile();
  return {
    recentIds: profile.recent,
    addRecentlyPlayed: recordLaunch,
  };
}
