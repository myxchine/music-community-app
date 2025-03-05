"use client";

import { signOut } from "next-auth/react";

export default function SignOut() {
  const handleSignOut = () => {
    signOut();
  };
  return (
    <button
      onClick={() => handleSignOut()}
      className="button-white text-xs cursor-pointer"
    >
      Sign Out
    </button>
  );
}
