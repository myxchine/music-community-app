"use client";
import SignOut from "./signout";
import { redirect } from "next/navigation";
import { UserIcon } from "@/components/ui/icons";
import Link from "next/link";
import SongList from "@/components/music/songs/song-list";
import { useSession } from "next-auth/react";
import { SongsLoadingSkeleton } from "@/components/music/songs/loading-skeleton";
import { useArtistSongsByIdQuery } from "@/hooks/useQuery";
import { Loading } from "@/components/loading";
export default function Account() {
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    redirect("/");
  }
  if (status === "loading") {
    return <Loading />;
  }
  if (!session) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-row items-center justify-start gap-4  w-full ">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt="user"
            width={100}
            height={100}
            className="rounded-full size-[100px] md:size-[125px] border border-black object-cover"
          />
        ) : (
          <UserIcon className="size-[100px] md:size-[125px] text-black" />
        )}
        <div className="flex flex-col  items-start justify-start text-left gap-2">
          <h1>{session.user.name}</h1>
          <div className="flex flex-row items-center gap-2">
            <Link href="/account/upload-song" className="button-black text-xs">
              {"Upload new song"}
            </Link>
            <SignOut />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Your Songs</h2>
          <p className="pill">Latest</p>
        </div>

        <YourSongs session={session} />
      </div>
    </div>
  );
}

function YourSongs({ session }: { session: { user: { id: string } } }) {
  const {
    isFetching,
    data: songs,
    error,
    isError,
  } = useArtistSongsByIdQuery(session.user.id);
  if (isFetching || !songs) {
    return <SongsLoadingSkeleton length={12} />;
  }
  if (isError || !songs) {
    return <p>Error: {error?.message}</p>;
  }
  return <SongList songs={songs} deleteable />;
}
