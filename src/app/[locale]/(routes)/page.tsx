import Link from "next/link";
export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
      <h1>Home</h1>
      <Link href="/upload">Upload New Song</Link>
    </div>
  );
}
