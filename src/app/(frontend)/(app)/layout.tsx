"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MusicPlayerProvider } from "@/hooks/music-player-provider";
import Header from "@/components/ui/header";
import { Toaster } from "sonner";
import Footer from "@/components/ui/footer";

export default function WebApp({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <MusicPlayerProvider>
          <Header />
          <main className="w-full max-w-[var(--max-width)] mx-auto flex flex-col items-center justify-center p-4 pb-84">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" />
        </MusicPlayerProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
