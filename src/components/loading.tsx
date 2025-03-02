import { SpinnerIcon } from "@/components/ui/icons";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-12 w-full">
      <SpinnerIcon className="size-6 animate-spin" />
    </div>
  );
}
