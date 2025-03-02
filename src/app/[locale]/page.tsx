import { getTranslations } from "next-intl/server";
import { getSongs } from "@/server/db/utils";
import SongList from "@/components/music/song-list";
export default async function Home() {
  const t = await getTranslations("HomePage");
  const songs = await getSongs();
  return (
    <>
      <div className="flex flex-col items-center justify-center"></div>
      <SongList songs={songs} />
    </>
  );
}
