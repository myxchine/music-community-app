import Link from "next/link";

export default function LinkButtom({
  children,
  href,
  type,
}: Readonly<{ children: React.ReactNode; href: string; type: number }>) {
  const buttonType = ["text-foreground ", "text-accent  "];

  return (
    <Link
      href={href}
      className={`${buttonType[type - 1]}   font-custom hover:underline font-bold`}
    >
      {children} {"->"}
    </Link>
  );
}
