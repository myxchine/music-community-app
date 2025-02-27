import SignOut from "@/components/signout";
import { redirect } from "next/navigation";
import { UserIcon } from "@/components/ui/icons";
import { getServerAuthSession } from "@/server/auth";
export default async function Account() {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect("/signin");
  }
  return (
    <>
      <Info session={session} />
      <h2>Account Actions</h2>
      <p className="text-xs md:text-sm text-black/60 ">{session.user.email}</p>
      <SignOut />
    </>
  );
}
function Info({ session }: { session: any }) {
  return (
    <div className="flex flex-row items-center gap-4 md:gap-8 w-full">
      {session.user.image ? (
        <img
          src={session.user.image}
          alt="user"
          width={100}
          height={100}
          className="rounded-full size-[100px] md:size-[125px] border border-black"
        />
      ) : (
        <UserIcon className="size-[100px] md:size-[125px] text-black" />
      )}
      <div className="flex flex-col  items-start justify-start text-left">
        <h1>{session.user.name}</h1>
        <p className=" pl-1 ">{session.user.role}</p>
      </div>
    </div>
  );
}
