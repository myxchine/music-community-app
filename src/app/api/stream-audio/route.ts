import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/server/songs-storage";
import { getServerAuthSession } from "@/server/auth";
export async function GET(request: Request) {
  // 1. Authenticate the user - only check if they're logged in
  const session = await getServerAuthSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get("key");
  if (!fileKey) {
    return NextResponse.json(
      { error: "File key is required" },
      { status: 400 }
    );
  }
  try {
    // 2. Generate a short-lived signed URL for the file
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileKey,
    });
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 900, // 15 minutes
    });
    return NextResponse.json({ url: presignedUrl });
  } catch (error) {
    console.error("Error generating audio URL:", error);
    return NextResponse.json(
      { error: "Failed to generate audio URL" },
      { status: 500 }
    );
  }
}
