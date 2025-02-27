import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});
export default async function LocaleLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const locale = (await params).locale;
  if (!["en", "pt", "fr", "de", "es"].includes(locale)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={`${interSans.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <header></header>
          <main>{children}</main>
          <footer></footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
