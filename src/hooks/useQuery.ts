import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSongs,
  getArtists,
  getSongsByArtist,
  getArtist,
} from "@/server/db/utils";

export const useSongsQuery = () => {
  return useQuery({
    queryKey: ["songs"],
    queryFn: getSongs,
    gcTime: 60 * 60 * 1000,
    staleTime: 60 * 60 * 1000,
    retry: 2,
  });
};

export const useArtistsQuery = () => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
    gcTime: 60 * 60 * 1000,
    staleTime: 60 * 60 * 1000,
    retry: 2,
  });
};

export const useArtistSongsByIdQuery = (artistId: string) => {
  return useQuery({
    queryKey: ["artist", artistId, "songs"],
    queryFn: () => getSongsByArtist(artistId),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    enabled: !!artistId,
  });
};

export const useArtistByIdQuery = (artistId: string) => {
  return useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => getArtist(artistId),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    enabled: !!artistId,
  });
};

export const useInvalidateSongs = () => {
  const queryClient = useQueryClient();

  const invalidateSongs = () => {
    queryClient.invalidateQueries({ queryKey: ["songs"] });
  };

  return { invalidateSongs };
};

export const useInvalideArtists = () => {
  const queryClient = useQueryClient();

  const invalidateArtists = () => {
    queryClient.invalidateQueries({ queryKey: ["artists"] });
  };

  return { invalidateArtists };
};

export const useInvalidateArtistSongs = (artistId: string) => {
  const queryClient = useQueryClient();

  const invalidateArtistSongs = () => {
    queryClient.invalidateQueries({ queryKey: ["artist", artistId, "songs"] });
  };

  return { invalidateArtistSongs };
};
