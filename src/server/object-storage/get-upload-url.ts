"use server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/server/object-storage/r2config";
import { generateUniqueFileName } from "@/server/object-storage/helpers";
const validAudioTypes = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/flac",
  "audio/aac",
  "audio/m4a",
];
export async function getUploadUrl({
  fileType,
  fileName,
}: {
  fileType: string;
  fileName: string;
}): Promise<{ presignedUrl: string | null; status: Status }> {
  if (!validAudioTypes.includes(fileType)) {
    console.error("Invalid file type");
    return {
      presignedUrl: null,
      status: { status: "error", message: "Invalid file type" },
    };
  }
  const id = generateUniqueFileName(fileName);
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: id,
      ContentType: fileType,
    });
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    });
    return {
      presignedUrl: presignedUrl,
      status: { status: "success", message: "File has been uploaded." },
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return {
      presignedUrl: null,
      status: { status: "error", message: "Failed to generate upload URL" },
    };
  }
}
