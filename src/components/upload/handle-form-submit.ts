import { getUploadUrl } from "@/server/songs-storage/get-upload-url";
export async function handleFormSubmit({
  file,
  setStatus,
  setIsUploading,
}: {
  file: File | null;
  setStatus: (status: Status) => void;
  setIsUploading: (uploading: boolean) => void;
}) {
  if (!file) {
    setStatus({ status: "error", message: "Please select a file." });
    return;
  }
  setIsUploading(true);
  setStatus({
    status: "neutral",
    message: "Please wait while your song is uploading",
  });
  try {
    // 1. Get the presigned URL from cloudflare to allow client side upload
    const { presignedUrl } = await getUploadUrl({
      fileType: file.type,
      fileName: file.name,
    });
    if (!presignedUrl) throw new Error("Failed to get upload URL");
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    if (!uploadResponse.ok) throw new Error("Upload failed");
    // 3. Let user know that their song has been uploaded
    setStatus({ status: "success", message: "File has been uploaded." });
  } catch (error) {
    console.error("Upload error:", error);
    setStatus({ status: "error", message: "Failed to upload file." });
  } finally {
    setIsUploading(false);
  }
}
