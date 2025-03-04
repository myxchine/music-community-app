import { Link } from "@/i18n/routing";
import { User } from "@/server/db/schema";

export default function ArtistList({ artists }: { artists: User[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {artists.map((artist) => (
        <Link
          key={artist.id}
          className="flex flex-col items-center justify-center gap-4 w-full"
          href={`/artists/${artist.id}`}
        >
          <img
            src={artist.image || "/images/default-cover.svg"}
            alt="artist image"
            className="w-full rounded-full aspect-square object-cover shadow"
          />
          <p className="text-sm">{artist.name}</p>
        </Link>
      ))}
    </div>
  );
}
