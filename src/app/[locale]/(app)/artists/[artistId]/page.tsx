import { getArtist } from "@/server/db/utils";
import { notFound } from "next/navigation";
import { ArtistSongs } from "./artist-songs";
import { UserIcon } from "@/components/ui/icons";
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
  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-row items-center justify-start gap-4  w-full ">
        {artist.image ? (
          <img
            src={artist.image}
            alt="user"
            width={100}
            height={100}
            className="rounded-full size-[100px] md:size-[125px] border border-black"
          />
        ) : (
          <UserIcon className="size-[100px] md:size-[125px] text-black" />
        )}
        <div className="flex flex-col  items-start justify-start text-left gap-2">
          <h1>{artist.name}</h1>
          <div className="flex flex-row items-center gap-2">
            <button className="button-black text-xs">Follow</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Your Songs</h2>
          <p className="pill">Latest</p>
        </div>

        <ArtistSongs artistId={artist.id} />
      </div>
    </div>
  );
}
