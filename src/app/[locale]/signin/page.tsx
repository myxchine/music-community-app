import GoogleButton from "./googlebutton";
export default async function SignIn() {
  return (
    <main className="flex flex-col items-center justify-center gap-6 h-[100svh] p-8">
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
