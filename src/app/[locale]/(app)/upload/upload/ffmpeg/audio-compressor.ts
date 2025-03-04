import type { FFmpeg } from "@ffmpeg/ffmpeg";

export async function compressAudio({
  ffmpeg,
  file,
}: {
  ffmpeg: FFmpeg;
  file: File;
}) {
  const outputFileName = "output.mp3";
  await ffmpeg.exec([
    "-i",
    file.name,
    "-vn",
    "-acodec",
    "libmp3lame",
    "-b:a",
    "96",
    outputFileName,
  ]);

  const data = (await ffmpeg.readFile(outputFileName)) as any;
  const compressedBlob = new Blob([data.buffer], { type: "audio/mpeg" });
  const compressedfile = new File([compressedBlob], "temp.mp3", {
    type: "audio/mpeg",
  });

  return {
    file: compressedfile,
    status: { status: "success", message: "File has been compressed." },
  };
}
