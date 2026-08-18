import { useProfile } from "../context/ProfileContext";

export function useFavorites() {
  const { profile, favoriteSet, toggleFavorite } = useProfile();
  return {
    favoriteIds: profile.favorites,
    favorites: favoriteSet,
    isFavorite: (id: string) => favoriteSet.has(id),
    toggleFavorite,
  };
}
