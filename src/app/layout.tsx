import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { cx } from "@/utils";
import { Navbar } from "@/components/nav";
import { Footer } from "@/components/footer";

const notoSansKr = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const notoSerifKr = Noto_Serif_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--noto_serif",
});

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
    <html
      lang="ko"
      className={cx(
        "text-neutral-800 bg-neutral-50",
        notoSansKr.className,
        notoSerifKr.variable
      )}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased max-w-screen-lg mt-8 mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-4 lg:px-0">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
