import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "@/app/globals.css";
import { Viewport } from "next";
const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});
const accent = localFont({
  src: "../fonts/custom.woff",
  variable: "--font-accent",
  weight: "100 900",
});
export const viewport: Viewport = {
  themeColor: "#ffffff",
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} ${accent.variable} antialiased`}>{children}</body>
    </html>
  );
}
