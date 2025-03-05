import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Viewport } from "next";
import Header from "./header";
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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
