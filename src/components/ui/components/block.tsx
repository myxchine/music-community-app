export default function Row({
  children,
  centered,
}: Readonly<{ children: React.ReactNode; centered?: boolean }>) {
  return (
    <div
      className={`flex  flex-col my-4 gap-4 ${
        centered ? "items-center justify-center text-center" : ""
      }`}
    >
      {children}
    </div>
  );
}
