"use client";

import SignOut from "@/app/[locale]/(app)/account/signout";
import { unauthorized } from "next/navigation";
import { UserIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/routing";
import { getSongsByArtist } from "@/server/db/utils";
import SongList from "@/components/music/songs/song-list";
import { Loading } from "@/components/loading";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { SongsLoadingSkeleton } from "@/components/music/songs/loading-skeleton";

export default function Account() {
  const { data: session, status } = useSession();
  if (!session) {
    unauthorized();
  }
  const t = useTranslations("AccountPage");
  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-row items-center justify-start gap-4  w-full ">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt="user"
            width={100}
            height={100}
            className="rounded-full size-[100px] md:size-[125px] border border-black"
          />
        ) : (
          <UserIcon className="size-[100px] md:size-[125px] text-black" />
        )}
        <div className="flex flex-col  items-start justify-start text-left gap-2">
          <h1>{session.user.name}</h1>
          <div className="flex flex-row items-center gap-2">
            <Link href="/upload" className="button-black text-xs">
              {t("upload new song")}
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
    isLoading,
    data: songs,
    error,
    isError,
  } = useQuery({
    queryKey: [`${session.user.id}-songs`],
    queryFn: () => getSongsByArtist(session.user.id),
  });
  if (isLoading || !songs) {
    return <SongsLoadingSkeleton length={12} />;
  }
  if (isError || !songs) {
    return <p>Error: {error?.message}</p>;
  }
  return <SongList songs={songs} deleteable />;
}
