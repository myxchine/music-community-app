"use client";
import SongList from "@/components/music/songs/song-list";
import { SongsLoadingSkeleton } from "@/components/music/songs/loading-skeleton";
import { useLikedSongsQuery } from "@/hooks/useQuery";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Loading } from "@/components/loading";
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
  const { isLoading, data: songs, error, isError } = useLikedSongsQuery(userId);
  if (isLoading || !songs) {
    return <SongsLoadingSkeleton length={12} />;
  }
  if (isError || !songs) {
    return <p>Error: {error?.message}</p>;
  }
  return <SongList songs={songs} />;
}
