import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export async function convertToMp3({
  ffmpeg,
  file,
}: {
  ffmpeg: FFmpeg;
  file: File;
}) {
  const inputFileName = "input." + file.name.split(".").pop();
  const outputFileName = "output.mp3";

  await ffmpeg.writeFile(inputFileName, await fetchFile(file));

  await ffmpeg.exec([
    "-i",
    inputFileName,
    "-map_metadata",
    "-1",
    "-acodec",
    "libmp3lame",
    "-b:a",
    "96k",
    outputFileName,
  ]);

  const mp3Data = (await ffmpeg.readFile(outputFileName)) as any;
  const mp3Blob = new Blob([mp3Data.buffer], { type: "audio/mp3" });
  const mp3File = new File([mp3Blob], "converted.mp3", {
    type: "audio/mp3",
  });

  return {
    status: { status: "success", message: "File has been compressed." },
    file: mp3File,
  };
}
