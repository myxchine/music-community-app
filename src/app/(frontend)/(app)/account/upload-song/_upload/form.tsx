"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { handleFormSubmit } from "./handle-form-submit";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { loadFFmpeg } from "./ffmpeg/ffmpeg-core";
import { SongWithArtistName } from "@/server/db/schema";
import { useMusicPlayer } from "@/hooks/music-player-provider";
import {
  useArtistSongsByIdQuery,
  useInvalidateSongDeletion,
  useSongsQuery,
  useLikedSongsQuery,
} from "@/hooks/useQuery";
import { useRouter } from "next/navigation";
export function SongUploadForm({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const router = useRouter();
  const { invalidateSongDeletion } = useInvalidateSongDeletion();
  const { refetch: refetchSongs } = useSongsQuery();
  const { refetch: refetchArtistSongs } = useArtistSongsByIdQuery(userId);
  const { refetch: refetchLikedSongs } = useLikedSongsQuery(userId);
  const [audioPreview, setAudioPreview] = useState<SongWithArtistName | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<Status>({
    status: "neutral",
    message: "Upload your song",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [FFmpegLoaded, setFFmpwgLoaded] = useState(false);

  const { addToQueue, resetQueue } = useMusicPlayer();

  useEffect(() => {
    load();
  }, []);

  const load = useCallback(async () => {
    await loadFFmpeg(ffmpegRef.current, setFFmpwgLoaded);
  }, []);

  useEffect(() => {
    if (audioPreview) {
      resetQueue();
      addToQueue(audioPreview);
    }
  }, [audioPreview, title, coverArtPreview]);

  useEffect(() => {
    if (title && audioPreview) {
      setAudioPreview({ ...audioPreview, title: title });
    }
  }, [title]);

  useEffect(() => {
    if (coverArtPreview && audioPreview) {
      setAudioPreview({ ...audioPreview, image: coverArtPreview });
    }
  }, [coverArtPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const audioFile = e.target.files[0];
      setFile(audioFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          console.log(e.target.result);

          const tempSong = {
            id: "temp",
            fileUrl: e.target.result as string,
            title,
            artistName: userName,
            artistId: userId,
            image: coverArtPreview
              ? coverArtPreview
              : "/images/default-cover.svg",
            categoryId: "temp",
            description: "temp",
            createdAt: new Date(),
          };
          setAudioPreview(tempSong);
        }
      };
      reader.readAsDataURL(audioFile);
    }
  };

  const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setCoverArt(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          console.log(e.target.result);
          setCoverArtPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !title || !coverArt) {
      setStatus({
        status: "error",
        message: "Something went wrong please try again",
      });
      return;
    }
    await handleFormSubmit({
      file,
      coverArt,
      setStatus,
      setIsUploading,
      title,
      ffmpegRef,
      invalidateSongDeletion,
      refetchSongs,
      refetchArtistSongs,
      refetchLikedSongs,
      router,
    });

    refetchArtistSongs();
    refetchSongs();
    refetchLikedSongs();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col w-full items-center justify-center gap-4"
    >
      <input
        type="text"
        name="title"
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-3 py-2 rounded-lg border"
      />

      <label
        htmlFor="file"
        className="block bg-black px-3 py-2 rounded-lg border w-full text-white text-center cursor-pointer"
      >
        Select audio file
        <input
          type="file"
          onChange={handleFileChange}
          accept="audio/mpeg, audio/mp3, audio/wav, audio/ogg, .mp3, .wav, .ogg, .m4a"
          required
          className="hidden"
          id="file"
        />
      </label>

      <div className="w-full">
        <label
          htmlFor="coverArt"
          className="block bg-black px-3 py-2 rounded-lg border w-full text-white text-center cursor-pointer mb-2"
        >
          Select cover art
          <input
            type="file"
            onChange={handleCoverArtChange}
            accept="image/*"
            className="hidden"
            required
            id="coverArt"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isUploading || !file || !FFmpegLoaded || !title || !coverArt}
        className={
          isUploading || !file || !FFmpegLoaded || !title || !coverArt
            ? "bg-black/10 text-black/50 w-full py-2 px-4 !cursor-not-allowed rounded-lg"
            : "w-full py-2 px-4 bg-[var(--foreground)] cursor-pointer hover:bg-[var(--foreground)]/80 text-white rounded-lg"
        }
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {status && (
        <p className={statusColours[status.status]}>{status.message}</p>
      )}
    </form>
  );
}

const statusColours = {
  neutral: "bg-black/5 px-3 py-2 text-center rounded-lg",
  success: "bg-green-100 text-green-800 px-3 py-2 text-center rounded-lg",
  error: "bg-red-100 text-red-800 px-3 py-2 text-center rounded-lg",
};
