import { getTranslations } from "next-intl/server";
import { getSongs, getArtists } from "@/server/db/utils";
import SongList from "@/components/music/song-list";
import ArtistList from "@/components/music/artist-list";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
export default function Home() {
  //const t = await getTranslations("HomePage");

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl font-semibold">Latest Songs</h2>
        <Suspense fallback={<Loading />}>
          <LatestSongs />
        </Suspense>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl font-semibold">Explore Artists</h2>
        <Suspense fallback={<Loading />}>
          <ExploreArtists />
        </Suspense>
      </div>
    </div>
  );
}

async function LatestSongs() {
  const songs = await getSongs();
  return <SongList songs={songs} />;
}

async function ExploreArtists() {
  const artists = await getArtists();
  return <ArtistList artists={artists} />;
}
