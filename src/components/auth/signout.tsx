"use client";

import { signOut } from "next-auth/react";

export default function SignOut() {
  const handleSignOut = () => {
    signOut();
  };
  return (
    <button
      onClick={() => handleSignOut()}
      className="bg-foreground cursor-pointer uppercase text-xs md:text-sm text-background  border border-black rounded border-accent hover:bg-black hover:text-white  p-2 text-center  px-4 w-fit 2"
    >
      Sign Out
    </button>
  );
}
