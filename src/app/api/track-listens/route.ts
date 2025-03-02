import { insertSongListens } from "@/server/db/utils";
import { SongListen } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";

let listenBuffer: SongListen[] = [];
const BATCH_SIZE = 100;
const FLUSH_INTERVAL = 5000;

async function flushListenBuffer() {
  if (listenBuffer.length > 0) {
    try {
      await insertSongListens(listenBuffer);
      console.log(
        `Flushed ${listenBuffer.length} listens to the database using Drizzle.`
      );
      listenBuffer = [];
    } catch (error) {
      console.error("Error flushing listen buffer (Drizzle):", error);
    }
  }
}
setInterval(flushListenBuffer, FLUSH_INTERVAL);
export async function POST(req: NextRequest) {
  const { userId, songId } = await req.json();
  if (!userId || !songId) {
    return NextResponse.json({
      error: "Missing user id or song id",
      status: 400,
    });
  }
  const timestamp = new Date();
  listenBuffer.push({ id: crypto.randomUUID(), userId, songId, timestamp });
  if (listenBuffer.length >= BATCH_SIZE) {
    await flushListenBuffer();
  }
  return NextResponse.json({ message: "Listen tracked", status: 200 });
}
