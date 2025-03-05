import SongUploadComponent from "@/app/(frontend)/(app)/upload/upload";
import { Loading } from "@/components/loading";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default function Home() {
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    redirect("/");
  }
  if (status === "loading") {
    return <Loading />;
  }
  if (!session) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
      <SongUploadComponent userId={session.user.id} />
    </div>
  );
}
