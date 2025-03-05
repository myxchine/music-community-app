import Link from "next/link";
export default function Header() {
  return (
    <header className="w-full max-w-5xl mx-auto flex flex-row items-center justify-between p-4 sticky top-0 z-10 bg-white">
      <Logo />
      <Link className="button-black text-xs" href="/signin">
        Sign Up
      </Link>
    </header>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="text-2xl md:text-4xl  font-accent uppercase !tracking-[1rem] text-center pl-2 md:pl-0"
    >
      Verzes
    </Link>
  );
}
