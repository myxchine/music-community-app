import crypto from "crypto";

export function generateUniqueFileName(originalName: string): string {
  const extension = originalName.split(".").pop();
  const randomString = crypto.randomBytes(16).toString("hex");
  return `${randomString}.${extension}`;
}
