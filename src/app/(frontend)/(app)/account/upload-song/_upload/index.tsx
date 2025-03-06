import NoSSRWrapper from "./no-ssr-wrapper";
import { SongUploadForm } from "./form";
import { Suspense } from "react";
import { Loading } from "@/components/loading";

export default function UploadAudioComponent({ userId, userName }: { userId: string, userName: string }) {
  return (
    <Suspense fallback={<Loading />}>
      <NoSSRWrapper>
        <SongUploadForm userId={userId}  userName={userName}/>
      </NoSSRWrapper>
    </Suspense>
  );
}
