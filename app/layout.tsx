import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DocsShell } from "@/components/docs-shell";
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
  title: {
    default: "Stepper",
    template: "%s - Stepper",
  },
  description:
    "A lightweight Stepper component for React, Next.js, Tailwind CSS, and shadcn/ui-style projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <DocsShell>{children}</DocsShell>
      </body>
    </html>
  );
}
