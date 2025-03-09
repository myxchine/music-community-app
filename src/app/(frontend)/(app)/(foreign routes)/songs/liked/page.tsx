"use client";
import SongList from "@/components/music/songs/song-list";
import { SongsLoadingSkeleton } from "@/components/music/songs/loading-skeleton";
import { useLikedSongsQuery } from "@/hooks/useQuery";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Loading } from "@/components/loading";
import { useMusicPlayer } from "@/hooks/music-player-provider";
import { PlayIcon } from "@/components/ui/icons";
export default function LikedSongsPage() {
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
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl font-semibold">Your Liked Songs</h2>

        <LikedSongs userId={session.user.id} />
      </div>
    </div>
  );
}

function LikedSongs({ userId }: { userId: string }) {
  const {
    isFetching,
    data: songs,
    error,
    isError,
  } = useLikedSongsQuery(userId);
  if (isFetching || !songs) {
    return <SongsLoadingSkeleton length={12} />;
  }
  if (isError || !songs) {
    return <p>Error: {error?.message}</p>;
  }

  const { resetQueue, setQueue, playSong } = useMusicPlayer();
  const handleLikedSongs = () => {
    resetQueue();
    playSong(songs[0]);
    setQueue(songs.slice(1));
  };
  return (
    <div className="flex flex-col gap-6 w-full">
      <button
        className="p-2 pl-5 pr-4 rounded-full bg-black w-fit flex flex-row items-center gap-1 text-white font-bold  hover:bg-black/80"
        onClick={handleLikedSongs}
      >
        Play all <PlayIcon className="size-6 pl-1 " fill="currentColor" />
      </button>
      <SongList songs={songs} />
    </div>
  );
}
