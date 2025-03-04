"use client";

import { useArtistByIdQuery } from "@/hooks/useQuery";
import SongList from "@/components/music/songs/song-list";
import { SongsLoadingSkeleton } from "@/components/music/songs/loading-skeleton";

export function ArtistSongs({ artistId }: { artistId: string }) {
  const {
    isLoading,
    data: songs,
    error,
    isError,
  } = useArtistByIdQuery(artistId);
  if (isLoading || !songs) {
    return <SongsLoadingSkeleton length={12} />;
  }
  if (isError || !songs) {
    return <p>Error: {error?.message}</p>;
  }
  return <SongList songs={songs} deleteable />;
}
