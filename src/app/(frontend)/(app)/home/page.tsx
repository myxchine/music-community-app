"use client";
import SongList from "@/components/music/songs/song-list";
import ArtistList from "@/components/music/artist-list";
import { SongsLoadingSkeleton } from "@/components/music/songs/loading-skeleton";
import { Loading } from "@/components/loading";
import Link from "next/link";
import { useArtistsQuery, useSongsQuery } from "@/hooks/useQuery";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default function Home() {
  const session = useSession();
  if (session.status === "unauthenticated") {
    return redirect("/");
  }
  if (session.status === "loading") {
    return <Loading />;
  }
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl font-semibold">Latest Songs</h2>
        <LatestSongs />
        <Link
          href="/songs"
          className="w-fit px-4 py-2 text-xs rounded-full border border-black hover:bg-black hover:text-white mx-auto"
        >
          See More
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
  const { isFetching, data: songs, error, isError } = useSongsQuery();
  if (isFetching || !songs) {
    return <SongsLoadingSkeleton length={3} />;
  }
  if (isError || !songs) {
    return <p>Error: {error?.message}</p>;
  }
  return <SongList songs={songs.slice(0, 3)} />;
}

function ExploreArtists() {
  const { isFetching, data: artists, error, isError } = useArtistsQuery();
  if (isFetching || !artists) {
    return <Loading />;
  }
  if (isError || !artists) {
    return <p>Error: {error?.message}</p>;
  }
  return <ArtistList artists={artists} />;
}
