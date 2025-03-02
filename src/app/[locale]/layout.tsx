import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { MusicPlayerProvider } from "@/components/music/music-player-provider";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { Toaster } from "sonner";
import { Viewport } from "next";
import { SessionProvider } from "next-auth/react";
const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});
export const viewport: Viewport = {
  themeColor: "#ffffff",
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
};
export default async function LocaleLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const locale = (await params).locale;
  if (!["en", "pt", "fr", "de", "es"].includes(locale)) {
    return notFound();
  }
  const t = await getTranslations("Global");
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={`${interSans.variable} antialiased `}>
        <NextIntlClientProvider messages={messages}>
          <MusicPlayerProvider>
            <Header />
            <main className="w-full max-w-[var(--max-width)] mx-auto flex flex-col items-center justify-center p-4 pb-84">
              {children}
            </main>
            <Footer locale={locale} />
            <Toaster position="top-center" />
          </MusicPlayerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
