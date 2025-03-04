"use client";
import { getSongs, getArtists } from "@/server/db/utils";
import SongList from "@/components/music/songs/song-list";
import ArtistList from "@/components/music/artist-list";
import { useQuery } from "@tanstack/react-query";
import { SongsLoadingSkeleton } from "@/components/music/songs/loading-skeleton";
import { Loading } from "@/components/loading";
import { Link } from "@/i18n/routing";
export default function Home() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl font-semibold">Latest Songs</h2>
        <LatestSongs />
        <Link
          href="/songs"
          className="w-fit px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white mx-auto"
        >
          See all songs
        </Link>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl font-semibold">Explore Artists</h2>
        <ExploreArtists />
      </div>
    </div>
  );
}

function LatestSongs() {
  const {
    isLoading,
    data: songs,
    error,
    isError,
  } = useQuery({ queryKey: ["songs"], queryFn: getSongs });
  if (isLoading || !songs) {
    return <SongsLoadingSkeleton length={3} />;
  }
  if (isError || !songs) {
    return <p>Error: {error?.message}</p>;
  }
  return <SongList songs={songs.slice(0, 3)} />;
}

function ExploreArtists() {
  const {
    isLoading,
    data: artists,
    error,
    isError,
  } = useQuery({ queryKey: ["artists"], queryFn: getArtists });
  if (isLoading || !artists) {
    return <Loading />;
  }
  if (isError || !artists) {
    return <p>Error: {error?.message}</p>;
  }
  return <ArtistList artists={artists} />;
}
