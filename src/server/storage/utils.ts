"use server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/server/storage";
import { SongWithArtistName, Song } from "@/server/db/schema";
import { getServerAuthSession } from "@/server/auth";
export async function deleteSongFromStorage(song: SongWithArtistName | Song) {
  const session = await getServerAuthSession();
  if (!session) {
    console.error("No session found");
    return false;
  }
  if (song.artistId !== session.user.id) {
    console.log("Song not owned by user");
    return false;
  }
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_AUDIO_BUCKET_NAME,
      Key: song.fileUrl,
    });
    const res = await s3Client.send(command);
    console.log(res);
    console.log("Deleted song from storage");
  } catch (error) {
    console.error("Error deleting song from storage:", error);
    throw new Error("Failed to delete song from storage");
  }
  return true;
}
export async function deleteImageFromStorage(song: SongWithArtistName | Song) {
  if (!song.image) return true;
  const session = await getServerAuthSession();
  if (!session) {
    console.error("No session found");
    return false;
  }
  if (song.artistId !== session.user.id) {
    console.log("Image not owned by user");
    return false;
  }
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_IMAGE_BUCKET_NAME,
      Key: song.image,
    });
    const res = await s3Client.send(command);
    console.log(res);

    console.log("Deleted song's image from storage");
  } catch (error) {
    console.error("Error deleting song's image from storage:", error);
    throw new Error("Failed to delete song's image from storage");
  }
  return true;
}
