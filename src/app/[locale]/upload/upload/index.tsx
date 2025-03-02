import NoSSRWrapper from "./no-ssr-wrapper";
import { SongUploadForm } from "./form";
import { Suspense } from "react";

export default function UploadAudioComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NoSSRWrapper>
        <SongUploadForm />
      </NoSSRWrapper>
    </Suspense>
  );
}
