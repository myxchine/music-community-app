import { useQuery } from "@tanstack/react-query";
import { getSongs, getArtists, getSongsByArtist } from "@/server/db/utils";

export const useSongsQuery = () => {
  return useQuery({
    queryKey: ["songs"],
    queryFn: getSongs,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
  });
};

export const useArtistsQuery = () => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
  });
};

export const useArtistByIdQuery = (artistId: string) => {
  return useQuery({
    queryKey: [`${artistId}-songs`],
    queryFn: () => getSongsByArtist(artistId),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
  });
};
