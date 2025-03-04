"use client";
import SongList from "@/components/music/songs/song-list";
import { SongsLoadingSkeleton } from "@/components/music/songs/loading-skeleton";
import { useSongsQuery } from "@/hooks/useQuery";
export default function Home() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl font-semibold">All Songs</h2>
        <AllSongs />
      </div>
    </div>
  );
}

function AllSongs() {
  const { isLoading, data: songs, error, isError } = useSongsQuery();
  if (isLoading || !songs) {
    return <SongsLoadingSkeleton length={12} />;
  }
  if (isError || !songs) {
    return <p>Error: {error?.message}</p>;
  }
  return <SongList songs={songs} />;
}
