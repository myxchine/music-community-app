import { Link } from "@/i18n/routing";
import { HeartEmptyIcon } from "./icons";

export default function Header() {
  return (
    <header className="w-full max-w-[var(--max-width)] mx-auto flex flex-row items-center justify-between p-4">
      <Link className="font-bold text-2xl" href="/">
        VERZES
      </Link>

      <Link className=" " href="/account">
        <HeartEmptyIcon className="size-6 " stroke="black" />
      </Link>
    </header>
  );
}
