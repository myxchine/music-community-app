"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  use,
} from "react";
import type { SongWithArtistName } from "@/server/db/schema";
import { toast } from "sonner";

interface MusicPlayerContextType {
  currentSong: SongWithArtistName | null;
  isPlaying: boolean;
  songLoading: boolean;
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
  setQueue: (queue: SongWithArtistName[]) => void;
  history: SongWithArtistName[];
  clearHistory: () => void;
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
  const [songLoading, setSongLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState<SongWithArtistName[]>([]);
  const [history, setHistory] = useState<SongWithArtistName[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<SongWithArtistName[]>([]);
  const historyRef = useRef<SongWithArtistName[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    if (queue.length > 0 && !currentSong) {
      console.log("Playing first song in queue");
      playSong(queue[0]);
    }
  }, [queue, currentSong]);

  useEffect(() => {
    audioRef.current = new Audio();

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("ended", handleSongEnd);
    audioRef.current.addEventListener("canplay", handleCanPlay);
    audioRef.current.addEventListener("waiting", handleWaiting);
    audioRef.current.addEventListener("error", handleError);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current.removeEventListener("ended", handleSongEnd);
        audioRef.current.removeEventListener("canplay", handleCanPlay);
        audioRef.current.removeEventListener("waiting", handleWaiting);
        audioRef.current.removeEventListener("error", handleError);
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    // Set loading state to true when starting to load a new song
    setSongLoading(true);

    let audioUrl;
    if (currentSong.fileUrl.startsWith("data:")) {
      audioUrl = currentSong.fileUrl;
    } else {
      audioUrl = `https://pub-b40ea9d340a94cb1a3dfa14413f628b2.r2.dev/${currentSong.fileUrl}`;
    }

    audioRef.current.src = audioUrl;
    audioRef.current.load();

    setMediaPlayerMetadata({
      song: currentSong,
      resumeSong,
      pauseSong,
      playNext,
      playPrevious,
    });
  }, [currentSong]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    if (!songLoading) {
      handleCanPlay();
    }
  }, [songLoading]);

  // Handle isPlaying state changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      if (audioRef.current.readyState >= 3) {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
          toast.error("Failed to play song. Please try again.");
        });
      }
      // If not ready, the canplay event will handle playback
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

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

  const handleCanPlay = () => {
    setSongLoading(false);

    // If we're supposed to be playing, start playback now that we can
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed after canplay event:", error);
        setIsPlaying(false);
        toast.error("Failed to play song. Please try again.");
      });
    }
  };

  const handleWaiting = () => {
    // Audio is waiting for more data, set loading state
    setSongLoading(true);
  };

  const handleError = (event: Event) => {
    console.error("Audio error:", event);
    setSongLoading(false);
    setIsPlaying(false);
    toast.error("Error loading audio. Please try again.");
  };

  const handleSongEnd = () => {
    if (queueRef.current.length === 0) {
      setIsPlaying(false);
      return;
    }

    if (queueRef.current.length > 0) {
      const nextSong = queueRef.current[0];
      console.log("Playing next song:", nextSong);

      // Add current song to history before moving to next
      if (currentSong) {
        addToHistory(currentSong);
      }

      // Set loading state to true when starting to load the next song
      setSongLoading(true);

      setQueue((prevQueue) => {
        const newQueue = prevQueue.slice(1);
        return newQueue;
      });

      // Directly play the song without waiting for state update
      setCurrentSong(nextSong);
      setIsPlaying(true);

      if (audioRef.current) {
        let audioUrl;
        if (nextSong.fileUrl.startsWith("data:")) {
          audioUrl = nextSong.fileUrl;
        } else {
          audioUrl = `https://pub-b40ea9d340a94cb1a3dfa14413f628b2.r2.dev/${nextSong.fileUrl}`;
        }

        audioRef.current.src = audioUrl;
        audioRef.current.load();
        setMediaPlayerMetadata({
          song: nextSong,
          resumeSong,
          pauseSong,
          playNext,
          playPrevious,
        });
      }
    }
  };

  const addToHistory = (song: SongWithArtistName) => {
    // Add to history (limited to last 20 songs)
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory, song];
      // Limit history size to prevent excessive memory usage
      if (newHistory.length > 20) {
        return newHistory.slice(newHistory.length - 20);
      }
      return newHistory;
    });
  };

  const playSong = (song: SongWithArtistName) => {
    // Add current song to history before changing songs
    if (currentSong) {
      addToHistory(currentSong);
    }

    // Set loading state when we start playing a new song
    setSongLoading(true);
    setCurrentSong(song);
    setIsPlaying(true);

    // The actual play() will be called in the canplay event handler
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSong = () => {
    if (audioRef.current && currentSong) {
      setIsPlaying(true);
      // The useEffect hook watching isPlaying will handle the actual playback
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
      // Set loading state when seeking as it might need to buffer
      setSongLoading(true);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      setSongLoading(false);
      // The loading state will be managed by the canplay/waiting events
    }
  };

  const addToQueue = (song: SongWithArtistName) => {
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue, song];
      return newQueue;
    });
  };

  const resetQueue = () => {
    setQueue([]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const playNext = () => {
    console.log("Manual playNext called");
    console.log("Current queue:", queueRef.current);

    if (queueRef.current.length > 0) {
      // Add current song to history before moving to next
      if (currentSong) {
        addToHistory(currentSong);
      }

      const nextSong = queueRef.current[0];
      console.log("Playing next song:", nextSong);

      // Set loading state when playing next
      setSongLoading(true);
      setQueue((prevQueue) => prevQueue.slice(1));

      // We call setCurrentSong and setIsPlaying directly instead of playSong
      // to avoid double-adding the current song to history
      setCurrentSong(nextSong);
      setIsPlaying(true);
    } else {
      toast.info("No more songs in queue");
    }
  };

  const playPrevious = () => {
    if (audioRef.current) {
      // If we're more than 3 seconds into the song, restart it
      if (audioRef.current.currentTime > 3) {
        // Set loading when rewinding as it might need to buffer from the start
        setSongLoading(true);
        audioRef.current.currentTime = 0;
      } else {
        // If we're less than 3 seconds into the song, go to previous song in history
        if (historyRef.current.length > 0) {
          // Get the most recent song from history
          const prevHistory = [...historyRef.current];
          const previousSong = prevHistory.pop();

          if (previousSong) {
            // Update history state without the song we're about to play
            setHistory(prevHistory);

            // Insert current song at the beginning of the queue
            if (currentSong) {
              setQueue((prevQueue) => [currentSong, ...prevQueue]);
            }

            // Play the previous song without adding current song to history again
            setSongLoading(true);
            setCurrentSong(previousSong);
            setIsPlaying(true);
          }
        } else {
          // No history available, just restart the current song
          setSongLoading(true);
          audioRef.current.currentTime = 0;
          toast.info("No previous songs in history");
        }
      }
    }
  };

  const contextValue: MusicPlayerContextType = {
    currentSong,
    isPlaying,
    songLoading,
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
    setQueue,
    history,
    clearHistory,
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

function setMediaPlayerMetadata({
  song,
  resumeSong,
  pauseSong,
  playNext,
  playPrevious,
}: {
  song: SongWithArtistName;
  resumeSong: () => void;
  pauseSong: () => void;
  playNext: () => void;
  playPrevious: () => void;
}) {
  if (!song) return;

  try {
    if ("mediaSession" in navigator) {
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

      // Setup media session action handlers
      navigator.mediaSession.setActionHandler("play", () => {
        resumeSong();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        pauseSong();
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        playNext();
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        playPrevious();
      });
    }
  } catch (error) {
    console.error("Failed to set media metadata:", error);
  }
}
