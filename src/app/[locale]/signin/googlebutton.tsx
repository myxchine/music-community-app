"use client";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/components/ui/icons";
export default function SignInPage() {
  return (
    <button
      onClick={() => signIn("google")}
      className="border border-foreground rounded-full bg-foreground text-background p-4 px-6 flex flex-row items-center  gap-3 hover:bg-black hover:text-white cursor-pointer"
    >
      <GoogleIcon className="size-8" />
      <p> Sign in with Google</p>
    </button>
  );
}
