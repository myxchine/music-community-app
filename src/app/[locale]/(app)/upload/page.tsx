import SongUploadComponent from "@/app/[locale]/(app)/upload/upload";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
      <SongUploadComponent />
    </div>
  );
}
