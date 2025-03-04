// TODO: create full screen music player that can be toggled on and off

"use client";
import { useMusicPlayer } from "@/hooks/music-player-provider";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    togglePlayPause,
    seekTo,
    playNext,
    playPrevious,
  } = useMusicPlayer();
  if (!currentSong) {
    return null;
  }
  return (
    <div className="text-white bg-black/80 rounded-xl backdrop-blur-sm  w-full overflow-hidden">
      <div className=" mx-auto flex items-center p-4">
        <div className="flex-1">
          <div className="font-bold">{currentSong.title}</div>
          <div className="text-sm text-gray-400">
            {currentSong.artistId || "Unknown Artist"}
          </div>
        </div>
        <button onClick={togglePlayPause} className="">
          {isPlaying ? (
            <PauseIcon className="size-8" fill="white" />
          ) : (
            <PlayIcon className="size-8 pl-1" fill="white" />
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
    <input
      type="range"
      min="0"
      max={duration || 0}
      value={currentTime}
      onChange={(e) => seekTo(parseFloat(e.target.value))}
      className="w-full border-none bg-transparent"
      step="0.01"
    />
  );
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
