import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export const loadFFmpeg = async (
  ffmpeg: FFmpeg,
  setFFmpegLoaded: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";

  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    setFFmpegLoaded(true);
  } catch (error) {
    console.error("Failed to load FFmpeg:", error);
    alert("Failed to load FFmpeg. See console for details.");
  }
};
