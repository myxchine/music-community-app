import { getArtist, getSongsByArtist } from "@/server/db/utils";
import SongList from "@/components/music/song-list";
import { notFound } from "next/navigation";
import { User } from "@/server/db/schema";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const artistId = (await params).artistId;
  const artist = await getArtist(artistId);

  if (!artist) {
    return notFound();
  }
  const songs = await getSongsByArtist(artistId);
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col items-center justify-center gap-4 w-full p-6">
        <img
          src={artist.image || "/images/default-cover.svg"}
          alt="artist image"
          className="w-full rounded-xl aspect-square object-cover"
        />
        <h1 className="text-xl font-semibold">{artist.name}</h1>
      </div>

      <h2 className="text-xl font-semibold">Songs</h2>
      <div className="flex flex-col gap-4 w-full">
        <Suspense fallback={<Loading />}>
          <ArtistSongs artist={artist} />
        </Suspense>
      </div>
    </div>
  );
}

async function ArtistSongs({ artist }: { artist: User }) {
  const songs = await getSongsByArtist(artist.id);
  return <SongList songs={songs} />;
}
