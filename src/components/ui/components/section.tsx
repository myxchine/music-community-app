export default function Section({
  children,
  full,
}: Readonly<{ children: React.ReactNode; full?: boolean }>) {
  return (
    <div className={`flex flex-col gap-8  w-full  relative  p-0 ${full ? "mb-4 md:mb-8 " : "md:my-4"}`}>
      {children}
    </div>
  );
}
