"use client";
import { useState } from "react";
import { handleFormSubmit } from "./handle-form-submit";
export function MusicUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({
    status: "neutral",
    message: "Upload your song",
  });
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFormSubmit({ file, setStatus, setIsUploading });
  };
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col w-full items-center justify-center gap-4"
    >
      <input type="file" onChange={handleFileChange} accept="audio/*" />
      <button
        type="submit"
        disabled={isUploading || !file}
        className="w-full py-2 px-4 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-white rounded-lg"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {status && (
        <p className={statusColours[status.status]}>{status.message}</p>
      )}
    </form>
  );
}
const statusColours = {
  neutral: "bg-black/5 px-3 py-1 text-center rounded-lg",
  success: "bg-green-100 text-green-800 px-3 py-1 text-center rounded-lg",
  error: "bg-red-100 text-red-800 px-3 py-1 text-center rounded-lg",
};
