import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A Thousand Words",
  description: "A picture is worth a thousand words, and so is a face.",
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
        <nav className="w-full p-4 border-b mb-8">
          <div className="max-w-3xl mx-auto flex justify-center items-center">
            <a href="/" className="textWh-2xl font-bold underline">
              Thousand Words
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
