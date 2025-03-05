"use client";
import Link from "next/link";
import MusicPlayer from "@/components/music/music-player";

import { usePathname } from "next/navigation";
import { SearchIcon, HomeIcon, AccountIcon } from "./icons";
const navItems = [
  {
    name: "home",
    href: "/home",
    icon: <HomeIcon className="size-6" fill="currentColor" />,
  },
  {
    name: "search",
    href: "/search",
    icon: <SearchIcon className="size-6" fill="currentColor" />,
  },
  {
    name: "account",
    href: "/account",
    icon: <AccountIcon className="size-6" fill="currentColor" />,
  },
];
export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="w-full fixed bottom-0 left-0 p-2 pb-0">
      <div className="w-full max-w-[var(--max-width)] mx-auto flex flex-col items-center justify-center gap-0">
        <MusicPlayer />
        <nav className="flex flex-row items-center justify-between gap-4 w-full p-4 bg-white pb-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              className={
                pathname === (item.href.length > 1 ? item.href : "")
                  ? navItemStyles.active
                  : navItemStyles.inactive
              }
              href={item.href}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
const navItemStyles = {
  active:
    "text-sm text-black hover:text-black flex flex-col gap-1 items-center justify-center",
  inactive:
    "text-sm text-black/60 hover:text-black flex flex-col gap-1 items-center justify-center",
};
