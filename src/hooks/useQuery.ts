import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getSongs,
  getArtists,
  getSongsByArtist,
  getArtist,
  getLikeStatus,
  likeSong,
  getLikedSongs,
} from "@/server/db/utils";
import { toast } from "sonner";
export const useSongsQuery = () => {
  return useQuery({
    queryKey: ["songs"],
    queryFn: getSongs,
  });
};

export const useLikedSongsQuery = (userId: string) => {
  return useQuery({
    queryKey: ["likedSongs", userId],
    queryFn: () => getLikedSongs(userId),
  });
};

export const useArtistsQuery = () => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
  });
};

export const useArtistSongsByIdQuery = (artistId: string) => {
  return useQuery({
    queryKey: ["artist", artistId, "songs"],
    queryFn: () => getSongsByArtist(artistId),
    enabled: !!artistId,
  });
};

export const useArtistByIdQuery = (artistId: string) => {
  return useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => getArtist(artistId),
    enabled: !!artistId,
  });
};

export const useSongLikeStatusQuery = ({
  songId,
  userId,
}: {
  songId: string;
  userId: string;
}) => {
  return useQuery({
    queryKey: ["song", songId, "likes"],
    queryFn: () => getLikeStatus({ songId, userId }),
    enabled: !!songId,
  });
};

export const useSongLikeMutation = ({
  userId,
  songId,
}: {
  userId: string;
  songId: string;
}) => {
  const { invalidateSong } = useInvalidateSong(songId);
  return useMutation({
    mutationFn: () => likeSong({ userId, songId }),
    mutationKey: ["likeSong", songId, userId],
    onSuccess: (data) => {
      invalidateSong();
      if (data && data.success && data.delta === 1) {
        toast.success("Song liked successfully");
        return;
      }
      if (data && data.success && data.delta === -1) {
        toast.success("Song unliked successfully");
        return;
      }
      if (data && !data.success) {
        toast.success("Failed to like song please try again");
        return;
      }
    },
    onError: () => {
      toast.error("Failed to like song please try again");
    },
  });
};

export const useInvalidateSong = (songId: string) => {
  const queryClient = useQueryClient();

  const invalidateSong = () => {
    queryClient.invalidateQueries({ queryKey: ["song", songId] });
  };

  return { invalidateSong };
};

export const useInvalidateSongs = () => {
  const queryClient = useQueryClient();

  const invalidateSongs = () => {
    console.log("invalidating all songs");
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
    console.log("invalidating artist songs for:", artistId);
    queryClient.invalidateQueries({ queryKey: ["artist", artistId, "songs"] });
  };

  return { invalidateArtistSongs };
};

export const useInvalidateSongDeletion = () => {
  const queryClient = useQueryClient();

  const invalidateSongDeletion = () => {
    queryClient.invalidateQueries({ queryKey: ["songs"] });
    queryClient.invalidateQueries({ queryKey: ["likedSongs"] });
    queryClient.invalidateQueries({ queryKey: ["artist", undefined, "songs"] });
    queryClient.invalidateQueries({ queryKey: ["artists"] });
  };

  return { invalidateSongDeletion };
};
