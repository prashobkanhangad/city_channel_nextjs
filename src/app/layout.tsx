import type { Metadata } from "next";
import { Noto_Serif_Malayalam } from "next/font/google";
import { buildRootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const notoMalayalam = Noto_Serif_Malayalam({
  variable: "--font-noto-malayalam",
  subsets: ["malayalam"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml" className={`${notoMalayalam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        {children}
      </body>
    </html>
  );
}
