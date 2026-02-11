import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import VapiWidget from "@/components/shared/Agent";
import Footer from "@/components/shared/Footer";

const geistSans = Mona_Sans({
  variable: "--font-mona-sans",
});

export const metadata: Metadata = {
  title: "Prepwise",
  description: "AI-Powered platform for preparing for mock interviews.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.className} antialiased pattern`}>
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
