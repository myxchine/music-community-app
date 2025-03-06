import { SongWithArtistName } from "@/server/db/schema";
import SongComponent from "./song";
export default function SongList({
  songs,
  deleteable,
}: {
  songs: SongWithArtistName[];
  deleteable?: boolean;
}) {
  if (songs.length === 0) return <NoSongs />;
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      {songs.map((song) => (
        <SongComponent song={song} key={song.id} deleteable={deleteable} />
      ))}
    </div>
  );
}
function NoSongs() {
  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto py-6">
      <h3 className="text-black/60">No songs found</h3>
    </div>
  );
}


