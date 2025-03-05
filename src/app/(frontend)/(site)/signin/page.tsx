import { redirect } from "next/navigation";
import GoogleButton from "./googlebutton";
import { getServerAuthSession } from "@/server/auth";
export default async function SignIn() {
  const session = await getServerAuthSession();
  if (session) {
    return redirect("/home");
  }
  return (
    <main className="flex flex-col items-center justify-center gap-6 my-24 p-8">
      <div className="flex flex-col items-center gap-2 text-center max-w-md">
        <h1 className="heading1">Sign Up</h1>
        <p>
          Sign in or create a new account and share your music, see what your
          friends are creating, discover new songs and more!
        </p>
      </div>
      <GoogleButton />
    </main>
  );
}
