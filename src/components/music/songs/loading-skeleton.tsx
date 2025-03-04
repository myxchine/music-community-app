import Image from "next/image";
import { MoreIcon } from "@/components/ui/icons";
export function SongsLoadingSkeleton({ length }: { length: number }) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      {Array.from({ length: length }).map((_, i) => (
        <div
          className="flex flex-row w-full items-cenet justify-center"
          key={i}
        >
          <div className="flex flex-row items-center justify-start w-full gap-3 cursor-pointer">
            <div className="w-18 h-18  bg-black/15 rounded-xl animate-pulse" />
            <div className="flex flex-col gap-1">
              <p className="animate-pulse h-[24px] w-[80px] bg-black/15 rounded-lg" />
              <p className="text-xs text-black/60 animate-pulse h-[16px] w-[50px] bg-black/15 rounded-lg"></p>
            </div>
          </div>
          <button className="w-fit l ml-auto flex flex-col items-center justify-center">
            <MoreIcon className="size-10 my-auto animate-pulse" fill="black" />
          </button>
        </div>
      ))}
    </div>
  );
}
