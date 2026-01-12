import "@fontsource/noto-sans-kr/300.css";
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/noto-serif-kr/300.css";
import "@fontsource/noto-serif-kr/400.css";
import "@fontsource/noto-serif-kr/500.css";
import "@fontsource/noto-serif-kr/700.css";
import "./globals.css";
import type { Metadata } from "next";
import {
  ConditionalNavbar,
  ConditionalFooter,
} from "@/components/conditional-navbar";

export const metadata: Metadata = {
  title: "-",
  description: "blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="text-neutral-800 bg-neutral-50">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased max-w-[768px] mt-8 mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-4 lg:px-0">
          <ConditionalNavbar />
          {children}
          <ConditionalFooter />
        </main>
      </body>
    </html>
  );
}
