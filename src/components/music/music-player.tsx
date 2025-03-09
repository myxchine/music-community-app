"use client";
import { useMusicPlayer } from "@/hooks/music-player-provider";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import Image from "next/image";
import { SpinnerIcon } from "@/components/ui/icons";
export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    songLoading,
    duration,
    currentTime,
    togglePlayPause,
    seekTo,
  } = useMusicPlayer();
  if (!currentSong) {
    return null;
  }

  const songImage =
    `https://pub-5d98fcdd24fb4227be900a856fef1126.r2.dev/${currentSong.image}` ||
    "/images/default-cover.svg";

  return (
    <div className="relative text-white bg-black/80  backdrop-blur-sm  w-full overflow-hidden rounded-2xl">
      <div className=" mx-auto flex flex-row items-center p-3 pb-2 gap-2">
        <Image
          src={
            currentSong.image
              ? currentSong.image.startsWith("data:") ||
                currentSong.image.startsWith("/images")
                ? currentSong.image
                : songImage
              : "/images/default-cover.svg"
          }
          alt="song cover art"
          width={100}
          height={100}
          className="rounded-xl size-16 aspect-square object-cover bg-white/10"
        />
        <div className="flex-1">
          <div className="text-lg">{currentSong.title}</div>
          <div className="text-sm text-white/60">{currentSong.artistName}</div>
        </div>
        <button onClick={togglePlayPause} className="">
          {songLoading ? (
            <SpinnerIcon className="size-10 animate-spin" />
          ) : isPlaying ? (
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
  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle click on the progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const percentageClicked = clickPositionX / rect.width;
    const newTime = percentageClicked * duration;
    seekTo(newTime);
  };

  return (
    <div className="relative w-full px-4">
      <div
        className="relative w-full h-2 rounded-full bg-white/30 overflow-hidden cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="absolute top-0 left-0 h-full bg-white/80 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />

        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seekTo(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          step="0.01"
          aria-label="Seek audio position"
        />
      </div>
    </div>
  );
}
