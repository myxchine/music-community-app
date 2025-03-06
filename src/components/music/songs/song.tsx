"use client";

import { SongWithArtistName } from "@/server/db/schema";
import { useMusicPlayer } from "@/hooks/music-player-provider";
import { useEffect, useState } from "react";
import { MoreIcon } from "@/components/ui/icons";
import Image from "next/image";
import { Modal } from "./song-modal";

export default function SongComponent({
  song,
  deleteable,
}: {
  song: SongWithArtistName;
  deleteable?: boolean;
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const { addToQueue, playSong, resetQueue } = useMusicPlayer();

  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (themeColorMeta) {
      if (modelOpen) {
        themeColorMeta.setAttribute("content", "#cccccc"); // 10% black
      } else {
        themeColorMeta.setAttribute("content", "#ffffff"); // white
      }
    }
  }, [modelOpen]);

  const handleClick = () => {
    resetQueue();
    addToQueue(song);
  };
  return (
    <div className="flex flex-row w-full items-cenet justify-center">
      <div
        className="flex flex-row items-center justify-start w-full gap-3 cursor-pointer"
        onClick={handleClick}
      >
        <Image
          src={
            `https://pub-5d98fcdd24fb4227be900a856fef1126.r2.dev/${song.image}` ||
            "/images/default-cover.svg"
          }
          width={100}
          height={100}
          priority
          alt="song cover art"
          className="w-18 h-18 object-cover aspect-square bg-black/5 rounded-xl"
        />
        <div className="flex flex-col gap-0 w-full">
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
          addToQueue={addToQueue}
        />
      )}
    </div>
  );
}
