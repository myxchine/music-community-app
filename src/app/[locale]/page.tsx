import { getTranslations } from "next-intl/server";
import { getSongs } from "@/server/db/utils";
import SongList from "@/components/music/song-list";
export default async function Home() {
  const t = await getTranslations("HomePage");
  const songs = await getSongs();
  return (
    <div className="flex flex-col gap-4 ">
      <h1 className="text-xl font-semibold">Latest Songs</h1>
      <SongList songs={songs} />
    </div>
  );
}
