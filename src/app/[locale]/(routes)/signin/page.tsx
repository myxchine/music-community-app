import GoogleButton from "./googlebutton";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await getServerAuthSession();
  if (session) {
    return redirect("/account");
  }
  return (
    <div>
      <h1>Sign Up</h1>
      <GoogleButton />
    </div>
  );
}
