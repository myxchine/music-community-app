"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import type { SongWithArtistName } from "@/server/db/schema";
import { toast } from "sonner";

interface MusicPlayerContextType {
  currentSong: SongWithArtistName | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  playSong: (song: SongWithArtistName) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  seekTo: (time: number) => void;
  togglePlayPause: () => void;
  queue: SongWithArtistName[];
  addToQueue: (song: SongWithArtistName) => void;
  playNext: () => void;
  playPrevious: () => void;
  resetQueue: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentSong, setCurrentSong] = useState<SongWithArtistName | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState<SongWithArtistName[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("ended", handleSongEnd);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current.removeEventListener("ended", handleSongEnd);
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    let audioUrl;

    if (currentSong.fileUrl.startsWith("data:")) {
      audioUrl = currentSong.fileUrl;
    } else {
      audioUrl = `https://pub-b40ea9d340a94cb1a3dfa14413f628b2.r2.dev/${currentSong.fileUrl}`;
    }

    audioRef.current.src = audioUrl;
    audioRef.current.load();

    setMediaPlayerMetadata(currentSong);

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  useEffect(() => {
    if (queue.length > 0) {
      playSong(queue[0]);
    }
  }, [queue]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSongEnd = () => {
    console.log("Song ended");
    console.log(queue);
    setIsPlaying(false);
    playNext();
  };

  const playSong = (song: SongWithArtistName) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSong = () => {
    if (audioRef.current && currentSong) {
      audioRef.current.play().catch((error) => {
        console.error("Resuming playback failed:", error);
      });
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const addToQueue = (song: SongWithArtistName) => {
    setQueue((prevQueue) => [...prevQueue, song]);
  };

  const resetQueue = () => {
    setQueue([]);
  };

  const playNext = () => {
    console.log(queue);
    if (queue.length > 0) {
      const nextSong = queue[0];
      console.log("next song", nextSong);
      setQueue((prevQueue) => prevQueue.slice(1));
      playSong(nextSong);
    }
  };

  const playPrevious = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  const contextValue: MusicPlayerContextType = {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    playSong,
    pauseSong,
    resumeSong,
    seekTo,
    togglePlayPause,
    queue,
    addToQueue,
    playNext,
    playPrevious,
    resetQueue,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
};

function setMediaPlayerMetadata(song: SongWithArtistName) {
  const meta = new MediaMetadata({
    title: song.title,
    artist: song.artistName,
    album: "V E R Z E S",
    artwork: [
      {
        src:
          `https://pub-5d98fcdd24fb4227be900a856fef1126.r2.dev/${song.image}` ||
          "/images/default-cover.svg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  });
  navigator.mediaSession.metadata = meta;
}
