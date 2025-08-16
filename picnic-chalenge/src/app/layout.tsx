import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Picnic Challenge",
  description: "Picnic Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <header className="border-b bg-gray-50">
          <nav className="max-w-6xl mx-auto flex gap-6 p-4 text-sm font-medium">
            <Link href="/" className="hover:underline">Tickets</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
