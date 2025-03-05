import Link from "next/link";
import { HeartEmptyIcon } from "./icons";

export default function Header() {
  return (
    <header className="w-full max-w-[var(--max-width)] mx-auto flex flex-row items-center justify-between p-4 sticky top-0 z-10 bg-white">
      <Link
        href="/home"
        className="text-2xl font-accent uppercase !tracking-[1rem] text-center pl-2 md:pl-0"
      >
        Verzes
      </Link>

      <Link className=" " href="/songs/liked">
        <HeartEmptyIcon className="size-6 " stroke="black" />
      </Link>
    </header>
  );
}
