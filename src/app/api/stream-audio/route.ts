import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/server/storage";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("name");
  if (!filename) {
    return NextResponse.json(
      { error: "File name is required" },
      { status: 400 }
    );
  }
  try {
    const getObjectParams = {
      Bucket: process.env.CLOUDFLARE_R2_AUDIO_BUCKET_NAME,
      Key: filename,
    };
    const command = new GetObjectCommand(getObjectParams);
    const response = await s3Client.send(command);

    if (!response.Body) {
      return NextResponse.json(
        { error: "File content is empty or unavailable" },
        { status: 404 }
      );
    }
    const contentType = response.ContentType || "audio/mpeg";
    const contentLength = response.ContentLength || 0;
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Length": contentLength.toString(),
    };

    const webStream = new ReadableStream({
      start(controller) {
        const stream = response.Body as any;

        stream.on("data", (chunk: Buffer) => {
          controller.enqueue(chunk);
        });

        stream.on("end", () => {
          controller.close();
        });

        stream.on("error", (error: Error) => {
          console.error("Stream error:", error);
          try {
            controller.error(
              new Error("Streaming interrupted, please try again.")
            );
          } catch (e) {
            console.error("Error closing stream:", e);
          }
        });
      },
    });
    return new NextResponse(webStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error streaming audio:", error);
    return NextResponse.json(
      { error: "Failed to stream audio." },
      { status: 500 }
    );
  }
}
