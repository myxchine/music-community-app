import { Link } from "@/i18n/routing";
import { HeartEmptyIcon } from "./icons";

export default function Header() {
  return (
    <header className="w-full max-w-[var(--max-width)] mx-auto flex flex-row items-center justify-between p-4 sticky top-0 z-10 bg-white">
      <Link className="font-bold text-2xl" href="/">
        VERZES
      </Link>

      <Link className=" " href="/songs/liked">
        <HeartEmptyIcon className="size-6 " stroke="black" />
      </Link>
    </header>
  );
}
