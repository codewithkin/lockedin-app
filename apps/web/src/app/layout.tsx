import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "A focus app that drops you into one task with the timer already running. Do it, mark it, next. Keep your streak alive. Discipline, made visible.";

export const metadata: Metadata = {
  title: "LockedIn — Stop scrolling. Start executing.",
  description,
  openGraph: {
    title: "LockedIn — Stop scrolling. Start executing.",
    description,
    siteName: "LockedIn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LockedIn — Stop scrolling. Start executing.",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#0A0A0A] text-neutral-200 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
