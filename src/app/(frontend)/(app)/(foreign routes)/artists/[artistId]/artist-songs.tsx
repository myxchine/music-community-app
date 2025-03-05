"use client";

import { useArtistSongsByIdQuery } from "@/hooks/useQuery";
import SongList from "@/components/music/songs/song-list";
import { SongsLoadingSkeleton } from "@/components/music/songs/loading-skeleton";

export function ArtistSongs({ artistId }: { artistId: string }) {
  const {
    isLoading,
    data: songs,
    error,
    isError,
  } = useArtistSongsByIdQuery(artistId);
  if (isLoading) {
    return <SongsLoadingSkeleton length={12} />;
  }
  if (isError) {
    return <p>Error: {error?.message}</p>;
  }
  return <SongList songs={songs || []} />;
}
