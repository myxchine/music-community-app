//import "server-only";
"use server";
import { db } from "@/server/db";
import { songs, likes, users, songListens } from "@/server/db/schema";
import { desc, sql, eq, and } from "drizzle-orm";
import type { Song, SongWithArtistName, SongListen } from "@/server/db/schema";
import { getServerAuthSession } from "@/server/auth";
import { unauthorized } from "next/navigation";

async function AuthenticatedQuery(): Promise<boolean> {
  const session = await getServerAuthSession();
  if (!session) return unauthorized();
  return true;
}
export async function getSongsByArtist(
  artistId: string
): Promise<SongWithArtistName[]> {
  if (!(await AuthenticatedQuery())) return [];
  try {
    const res = await db
      .select()
      .from(songs)
      .innerJoin(users, eq(songs.artistId, users.id))
      .where(eq(songs.artistId, artistId))
      .orderBy(desc(songs.createdAt))
      .limit(100);

    return res.map((object) => ({
      ...object.song,
      artistName: object.user.name,
    }));
  } catch (error) {
    console.error("Error getting songs by artist:", error);
    return [];
  }
}
export async function getSongByFileUrl(fileUrl: string): Promise<Song | null> {
  if (!(await AuthenticatedQuery())) return null;
  try {
    const res = await db
      .select()
      .from(songs)
      .where(eq(songs.fileUrl, fileUrl))
      .limit(1);
    if (!res) throw new Error("No songs found");
    return res[0];
  } catch (error) {
    console.error("Error getting song by fileUrl:", error);
    return null;
  }
}
export async function getSongs(): Promise<SongWithArtistName[]> {
  if (!(await AuthenticatedQuery())) return [];
  try {
    const res = await db
      .select()
      .from(songs)
      .innerJoin(users, eq(songs.artistId, users.id))
      .orderBy(desc(songs.createdAt))
      .limit(60);
    if (!res) throw new Error("No songs found");
    return res.map((object) => ({
      ...object.song,
      artistName: object.user.name,
    }));
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

export async function getLikedSongs(
  userId: string
): Promise<SongWithArtistName[]> {
  if (!(await AuthenticatedQuery())) return [];
  try {
    const res = await db
      .select()
      .from(songs)
      .where(eq(likes.userId, userId))
      .innerJoin(users, eq(songs.artistId, users.id))
      .orderBy(desc(songs.createdAt))
      .limit(60);
    if (!res) throw new Error("No songs found");
    return res.map((object) => ({
      ...object.song,
      artistName: object.user.name,
    }));
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    return [];
  }
}
interface LikeStatus {
  likesCount: number;
  isLiked: boolean;
}
export async function getLikeStatus({
  userId,
  songId,
}: {
  userId?: string;
  songId: string;
}): Promise<LikeStatus> {
  try {
    const result = await db
      .select({
        likesCount: sql<number>`COUNT(${likes.userId})`.as("likes_count"),
        isLiked: userId
          ? sql<boolean>`BOOL_OR(${likes.userId} = ${userId})`.as("is_liked")
          : sql<boolean>`false`.as("is_liked"),
      })
      .from(likes)
      .where(eq(likes.songId, songId));
    const { likesCount, isLiked } = result[0] || {
      likesCount: 0,
      isLiked: false,
    };
    return { likesCount, isLiked };
  } catch (error) {
    console.error("Error fetching like status:", error);
    return { likesCount: 0, isLiked: false };
  }
}

export async function likeSong(userId: string, songId: string) {
  if (typeof userId !== "string" || typeof songId !== "string") {
    console.error("Invalid userId or songId");
    return {
      success: false,
      delta: 0,
      message: "Invalid userId or songId.",
    };
  }
  try {
    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.songId, songId)));
    if (existingLike.length > 0) {
      await db
        .delete(likes)
        .where(and(eq(likes.userId, userId), eq(likes.songId, songId)));
      return {
        success: true,
        delta: -1,
        message: "Like removed successfully.",
      };
    }
    await db.insert(likes).values({
      userId,
      songId,
    });
    return { success: true, delta: 1, message: "song liked successfully." };
  } catch (error) {
    console.error("Error toggling like:", error);
    return {
      success: false,
      delta: 0,
      message: "Something went wrong.",
    };
  }
}

export async function getSong(songId: string): Promise<Song | null> {
  try {
    const data = await db
      .select()
      .from(songs)
      .where(eq(songs.id, songId))
      .limit(1);
    if (!data) return null;
    return data[0];
  } catch (error) {
    console.error("Error fetching song:", error);
    return null;
  }
}

export async function newSong({
  fileUrl,
  title,
  imageUrl,
}: {
  fileUrl: string;
  title: string;
  imageUrl?: string;
}) {
  const session = await getServerAuthSession();
  if (!session)
    return {
      song: null,
      status: { status: "error", message: "Please sign in to upload a song." },
    };
  try {
    const song = await db
      .insert(songs)
      .values({
        fileUrl,
        title,
        artistId: session.user.id,
        image: imageUrl || null,
      })
      .returning();
    return {
      song: song[0],
      status: { status: "success", message: "Song created successfully." },
    };
  } catch (error) {
    console.error("Error creating new song:", error);
    return {
      song: null,
      status: { status: "error", message: "Failed to create new song." },
    };
  }
}

export async function deleteSong({
  song,
}: {
  song: SongWithArtistName | Song;
}): Promise<Status> {
  const session = await getServerAuthSession();
  if (!session)
    return { status: "error", message: "Please sign in to delete your song." };
  if (song.artistId !== session.user.id)
    return {
      status: "error",
      message: "You are not authorized to delete this song.",
    };
  try {
    await db.delete(songs).where(eq(songs.fileUrl, song.fileUrl));
    return { status: "success", message: "Song deleted successfully." };
  } catch (error) {
    console.error("Error deleting song:", error);
    return { status: "error", message: "Failed to delete song." };
  }
}

export async function insertSongListens(listens: SongListen[]) {
  await db.insert(songListens).values(listens);
}
