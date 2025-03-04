import { getUploadUrl } from "@/server/storage/get-upload-url";
import { newSong, deleteSong } from "@/server/db/utils";
import { generateUniqueFileName } from "@/server/storage/helpers";
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { convertToMp3 } from "./ffmpeg/audio-converter";
export async function handleFormSubmit({
  file,
  setStatus,
  setIsUploading,
  title,
  ffmpegRef,
  coverArt,
}: {
  file: File;
  setStatus: (status: Status) => void;
  setIsUploading: (uploading: boolean) => void;
  title: string;
  ffmpegRef: React.RefObject<FFmpeg>;
  coverArt: File;
}) {
  if (!file) {
    setStatus({ status: "error", message: "Please select a file." });
    return;
  }
  setIsUploading(true);
  setStatus({
    status: "neutral",
    message: "Please wait while your song is uploading",
  });
  const fileType = file.type;

  const isAudioFile = fileType.startsWith("audio/");

  const isCoverArtFile = coverArt && coverArt.type.startsWith("image/");

  if (!isAudioFile) {
    return {
      status: { status: "error", message: "Invalid audio type" },
    };
  }

  if (!isCoverArtFile) {
    return {
      status: { status: "error", message: "Invalid cover art type" },
    };
  }

  let compressedAudioFile: File | null = null;

  setStatus({ status: "neutral", message: "Compressing audio..." });

  try {
    const { status, file: compressedAudio } = await convertToMp3({
      ffmpeg: ffmpegRef.current,
      file,
    });

    if (status.status === "error") {
      throw new Error("Failed to compress audio.");
    }
    if (!compressedAudio) {
      throw new Error("Failed to compress audio.");
    }

    compressedAudioFile = compressedAudio;
  } catch (error) {
    console.error("Error compressing audio:", error);
    setStatus({
      status: "error",
      message: "Failed to compress audio.",
    });
  }
  if (!compressedAudioFile) {
    setStatus({ status: "error", message: "Failed to compress audio." });
    setIsUploading(false);
    return;
  }

  setStatus({ status: "neutral", message: "Creating new song..." });

  let song;

  const audioId = generateUniqueFileName({
    fileName: compressedAudioFile.name,
  });
  const imageId = generateUniqueFileName({ fileName: coverArt.name });

  try {
    const res = await newSong({
      fileUrl: audioId,
      title: title,
      imageUrl: imageId,
    });
    if (!res || res.status.status === "error")
      throw new Error("Failed to create new song");
    song = res.song;

    if (!song) throw new Error("Failed to create new song");
  } catch (error) {
    console.error("Error creating new song on database:", error);
    setStatus({ status: "error", message: "Failed to create new song." });
    setIsUploading(false);
    return;
  }

  if (!song) throw new Error("Failed to create new song");

  setStatus({ status: "neutral", message: "Publishing song..." });

  try {
    const { presignedUrl } = await getUploadUrl({
      fileType: compressedAudioFile.type,
      id: audioId,
      bucket: "music",
    });
    if (!presignedUrl) throw new Error("Failed to get upload URL");
    const uploadAudio = await fetch(presignedUrl, {
      method: "PUT",
      body: compressedAudioFile,
      headers: {
        "Content-Type": compressedAudioFile.type,
      },
    });
    if (!uploadAudio.ok) throw new Error("Upload failed");

    const { presignedUrl: presignedImageUrl } = await getUploadUrl({
      fileType: coverArt.type,
      id: imageId,
      bucket: "images",
    });
    if (!presignedImageUrl) throw new Error("Failed to get upload URL");

    const uploadImage = await fetch(presignedImageUrl, {
      method: "PUT",
      body: coverArt,
      headers: {
        "Content-Type": coverArt.type,
      },
    });
    if (!uploadImage.ok) throw new Error("Upload failed");
    setStatus({ status: "success", message: "File has been uploaded." });
  } catch (error) {
    console.error("Upload to R2 error:", error);
    console.log("Deleting song record from database");
    const status = await deleteSong({ song });
    console.log("Song delete status:", status);
    setStatus({ status: "error", message: "Failed to upload file." });
  } finally {
    setIsUploading(false);
  }
}
