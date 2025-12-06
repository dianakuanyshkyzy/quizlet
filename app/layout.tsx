import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Imba Learn",
  description: "Test your skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}

        <footer className="fixed w-full py-4 bottom-0 text-center text-sm text-gray-600 border-t">
          <p>
            &copy; {new Date().getFullYear()} Imba Learn. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
