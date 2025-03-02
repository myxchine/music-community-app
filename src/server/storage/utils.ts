"use server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/server/storage";
import { deleteSong } from "../db/utils";
import { SongWithArtistName } from "@/server/db/schema";
import { getServerAuthSession } from "@/server/auth";

export async function deleteSongFromStorage(song: SongWithArtistName) {
  const session = await getServerAuthSession();

  if (!session)
    return { status: "error", message: "Please sign in to delete your song." };
  if (song.artistId !== session.user.id)
    return {
      status: "error",
      message: "You are not authorized to delete this song.",
    };
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: song.fileUrl,
    });
    await s3Client.send(command);
    console.log("Deleted song from storage");
  } catch (error) {
    console.error("Error deleting song from storage:", error);
    throw new Error("Failed to delete song from storage");
  }
  deleteSong({ song });
  return true;
}
