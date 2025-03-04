import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { Viewport } from "next";
import { getMessages } from "next-intl/server";
import { getServerAuthSession } from "@/server/auth";
import SessionProvider from "@/components/auth/session-provider";
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
  const messages = await getMessages();
  const session = await getServerAuthSession();
  return (
    <html lang={locale}>
      <body className={`${interSans.variable} antialiased `}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider session={session}>{children}</SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
