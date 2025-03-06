"use client";
import { useMusicPlayer } from "@/hooks/music-player-provider";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import Image from "next/image";
import { SongWithArtistName } from "@/server/db/schema";
export default function MusicPlayer({ song }: { song: SongWithArtistName }) {
  const {
    isPlaying,
    duration,
    currentTime,
    togglePlayPause,
    seekTo,
    playSong,
    pauseSong,
  } = useMusicPlayer();
  if (!song) {
    return null;
  }

  const handleNewSongClick = () => {
    playSong(song);
  };

  return (
    <div className="relative text-white bg-black/80  backdrop-blur-sm  w-full overflow-hidden rounded-2xl">
      <div className=" mx-auto flex flex-row items-center p-3 pb-2 gap-2">
        <Image
          src={song.image || "/images/default-cover.svg"}
          alt="song cover art"
          width={100}
          height={100}
          className="rounded-xl size-16 aspect-square object-cover bg-white/10"
        />
        <div className="flex-1">
          <div className="text-lg">{song.title}</div>
          <div className="text-sm text-white/60">{song.artistName}</div>
        </div>
        <button onClick={handleNewSongClick} className="" type="button">
          {isPlaying ? (
            <PauseIcon className="size-10" fill="white" />
          ) : (
            <PlayIcon className="size-10 pl-1" fill="white" />
          )}
        </button>
      </div>
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        seekTo={seekTo}
      />
    </div>
  );
}
function ProgressBar({
  currentTime,
  duration,
  seekTo,
}: {
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
}) {
  return (
    <div className="relative  w-full px-4">
      <div className="w-full h-2 rounded-full bg-white/30 overflow-hidden">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seekTo(parseFloat(e.target.value))}
          className="w-full cursor-pointer"
          step="0.01"
        />
      </div>
    </div>
  );
}
