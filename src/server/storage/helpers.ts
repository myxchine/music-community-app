import crypto from "crypto";

export function generateUniqueFileName({ fileName }: { fileName: string }) {
  const extension = fileName.split(".").pop();
  const randomString = crypto.randomBytes(16).toString("hex");
  return `${randomString}.${extension}`;
}
