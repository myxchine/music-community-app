import { getTranslations } from "next-intl/server";
import { getSongs, getArtists } from "@/server/db/utils";
import SongList from "@/components/music/song-list";
import ArtistList from "@/components/music/artist-list";
export default async function Home() {
  const t = await getTranslations("HomePage");
  const songs = await getSongs();
  const artists = await getArtists();
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl font-semibold">Latest Songs</h2>
        <SongList songs={songs} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl font-semibold">Explore Artists</h2>
        <ArtistList artists={artists} />
      </div>
    </div>
  );
}
