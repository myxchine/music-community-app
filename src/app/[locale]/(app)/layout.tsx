"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { unauthorized } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MusicPlayerProvider } from "@/hooks/music-player-provider";
import Header from "@/components/ui/header";
import { Toaster } from "sonner";
import Footer from "@/components/ui/footer";
export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  if (session.status === "unauthenticated") {
    return unauthorized();
  }
  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  const queryClient = new QueryClient();
  return (
    <SessionProvider session={session.data}>
      <MusicPlayerProvider>
        <QueryClientProvider client={queryClient}>
          <Header />
          <main className="w-full max-w-[var(--max-width)] mx-auto flex flex-col items-center justify-center p-4 pb-84">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" />
        </QueryClientProvider>
      </MusicPlayerProvider>
    </SessionProvider>
  );
}
