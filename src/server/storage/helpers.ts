import crypto from "crypto";

export function generateUniqueFileName() {
  return crypto.randomBytes(16).toString("hex");
;
}
