import Image from "next/image";
export default function ImageCard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Image
      src="/images/placeholder.png"
      alt="placeholder"
      width={400}
      height={400}
      className="rounded-lg"
    />
  );
}
