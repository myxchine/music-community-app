"use client";

import { SongWithArtistName } from "@/server/db/schema";
import { useMusicPlayer } from "@/components/music/music-player-provider";
import { useEffect, useState } from "react";
import { MoreIcon } from "@/components/ui/icons";
import { deleteSong } from "@/server/db/utils";
import { toast } from "sonner";
import Image from "next/image";

export default function SongComponent({
  song,
  deleteable,
}: {
  song: SongWithArtistName;
  deleteable?: boolean;
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const { addToQueue, playSong } = useMusicPlayer();

  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (themeColorMeta) {
      if (modelOpen) {
        themeColorMeta.setAttribute("content", "rgba(0, 0, 0, 0.1)"); // 10% black
      } else {
        themeColorMeta.setAttribute("content", "#ffffff"); // white
      }
    }
  }, [modelOpen]);

  const handleClick = () => {
    addToQueue(song);
    playSong(song);
  };
  return (
    <div className="flex flex-row w-full items-cenet justify-center">
      <div
        className="flex flex-row items-center justify-start w-full gap-6 cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={
            `https://pub-5d98fcdd24fb4227be900a856fef1126.r2.dev/${song.image}` ||
            "/images/default-cover.svg"
          }
          alt="song cover art"
          className="w-1/6 object-cover aspect-square bg-black/5 rounded-xl"
        />
        <div className="flex flex-col gap-0">
          <p>{song.title}</p>
          <p className="text-xs text-black/60">{song.artistName}</p>
        </div>
      </div>
      <button
        onClick={() => (modelOpen ? setModelOpen(false) : setModelOpen(true))}
        className="w-fit l ml-auto flex flex-col items-center justify-center"
      >
        <MoreIcon className="size-10 my-auto" fill="black" />
      </button>
      {modelOpen && (
        <Modal
          song={song}
          deleteable={deleteable}
          setModelOpen={setModelOpen}
        />
      )}
    </div>
  );
}

function Modal({
  song,
  deleteable,
  setModelOpen,
}: {
  song: SongWithArtistName;
  deleteable?: boolean;
  setModelOpen: (open: boolean) => void;
}) {
  const handleDelete = async () => {
    const success = await deleteSong({ song });
    if (!success) {
      toast.error("Failed to delete song");
      return;
    }
    toast.success("Song deleted successfully");
    setModelOpen(false);
  };
  return (
    <div className="flex flex-col justify-end gap-4 fixed bottom-0 left-0 w-full z-[999999999] h-[100svh] bg-black/20 backdrop-blur-md px-2">
      <div className="max-w-[var(--max-width)] mx-auto flex flex-col items-center justify-center w-full">
        <div className="flex flex-col gap-4 w-full items-center justify-start bg-white rounded-t-3xl p-6  ">
          <div className="flex flex-row gap-3 w-full items-center ">
            <Image
              src={
                `https://pub-5d98fcdd24fb4227be900a856fef1126.r2.dev/${song.image}` ||
                "/images/default-cover.svg"
              }
              alt="song cover art"
              width={100}
              height={100}
              className="rounded-xl  size-32 aspect-square object-cover bg-white/10"
            />
            <div>
              <p className="text-xl">{song.title}</p>
              <p className="text-sm">{song.artistName}</p>
            </div>
          </div>

          <button className="w-full button-black">Add to queue</button>
          <button className="w-full button-black">Like song</button>
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
