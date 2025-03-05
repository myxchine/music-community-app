export default function Component({
  children,
  centered,
  row,
  justifybetween,
  small,
  padding,
}: Readonly<{
  children: React.ReactNode;
  centered?: boolean;
  row?: boolean;
  justifybetween?: boolean;
  small?: boolean;
  padding?: boolean;
}>) {
  return (
    <div
      className={`flex flex-col gap-0 md:gap-2   w-full     ${
        centered ? "items-center text-center justify-center mx-auto" : ""
      } ${small ? "max-w-2xl " : null}
      ${padding ? "my-12 md:my-16" : null}
      `}
    >
      {children}
    </div>
  );
}
