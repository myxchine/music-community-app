"use client";

import { SongWithArtistName } from "@/server/db/schema";
import Image from "next/image";
import { deleteSong } from "@/server/db/utils";
import { toast } from "sonner";
import { getSession, useSession } from "next-auth/react";
import { useSongLikeMutation } from "@/hooks/useQuery";
import { useInvalidateSongs, useInvalidateArtistSongs } from "@/hooks/useQuery";
export function Modal({
  song,
  deleteable,
  setModelOpen,
  addToQueue,
}: {
  song: SongWithArtistName;
  deleteable?: boolean;
  setModelOpen: (open: boolean) => void;
  addToQueue: (song: SongWithArtistName) => void;
}) {
  const { invalidateSongs } = useInvalidateSongs();
  const { invalidateArtistSongs } = useInvalidateArtistSongs(song.artistId);
  const handleDelete = async () => {
    const session = await getSession();
    if (!session?.user?.id) {
      console.error("Session not found");
      toast.error("Failed to delete song");
      return;
    }
    if (song.artistId !== session.user.id) {
      console.error("Song not owned by user");
      toast.error("Failed to delete song");
      return;
    }
    const success = await deleteSong({ song });
    if (!success) {
      console.error("Failed to delete song from database");
      toast.error("Failed to delete song");
      return;
    }
    invalidateSongs();
    invalidateArtistSongs();
    toast.success("Song deleted successfully");
    setModelOpen(false);
  };

  const handleAddToQueue = () => {
    addToQueue(song);
    toast.success("Song added to queue");
    setModelOpen(false);
  };
  const session = useSession();

  if (!session?.data) {
    return;
  }
  const { mutate } = useSongLikeMutation({
    songId: song.id,
    userId: session.data.user.id,
  });
  const handleLikeSong = () => {
    mutate();
    setModelOpen(false);
  };

  return (
    <div className="flex flex-col justify-end gap-4 fixed bottom-0 left-0 w-full z-[999999999] h-[100svh] bg-black/20 backdrop-blur-md px-2">
      <div className="max-w-[var(--max-width)] mx-auto flex flex-col items-center justify-center w-full">
        <div className="flex flex-col gap-4 w-full items-center justify-start bg-white rounded-t-3xl p-6  pb-12 ">
          <div className="flex flex-row gap-3 w-full items-center pb-4">
            <Image
              src={
                `https://pub-5d98fcdd24fb4227be900a856fef1126.r2.dev/${song.image}` ||
                "/images/default-cover.svg"
              }
              alt="song cover art"
              width={100}
              height={100}
              priority
              className="rounded-xl  size-24 aspect-square object-cover bg-white/10"
            />
            <div>
              <p className="text-xl">{song.title}</p>
              <p className="text-sm">{song.artistName}</p>
            </div>
          </div>

          <button className="w-full button-black" onClick={handleAddToQueue}>
            Add to queue
          </button>
          <button className="w-full button-black" onClick={handleLikeSong}>
            Toggle like song
          </button>
          {deleteable && (
            <button onClick={handleDelete} className="button-black w-full">
              Delete Song
            </button>
          )}
          <button
            onClick={() => setModelOpen(false)}
            className="button-black w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
