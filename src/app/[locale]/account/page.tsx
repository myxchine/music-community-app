import SignOut from "@/components/auth/signout";
import { unauthorized } from "next/navigation";
import { UserIcon } from "@/components/ui/icons";
import { getServerAuthSession } from "@/server/auth";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getSongsByArtist } from "@/server/db/utils";
import SongList from "@/components/music/song-list";
import { Suspense } from "react";
import { Loading } from "@/components/loading";

export default async function Account() {
  const session = await getServerAuthSession();
  if (!session) {
    console.log("Unauthorized");
    unauthorized();
  }
  const t = await getTranslations("AccountPage");
  const songs = await getSongsByArtist(session.user.id);
  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col items-center justify-center gap-4 md:gap-8 w-full mb-6">
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
        <div className="flex flex-col  items-start justify-start text-left">
          <h1>{session.user.name}</h1>
        </div>
        <Link href="/upload" className="button-black">
          {t("upload new song")}
        </Link>
        <SignOut />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Your Songs</h2>
        <Suspense fallback={<Loading />}>
          <YourSongs session={session} />
        </Suspense>
      </div>
    </div>
  );
}

async function YourSongs({ session }: { session: { user: { id: string } } }) {
  const songs = await getSongsByArtist(session.user.id);
  return <SongList songs={songs} deleteable />;
}
