import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "";

export const metadata: Metadata = {
  title: {
    default: "ツールボックス - 無料オンラインツール集",
    template: "%s | ツールボックス",
  },
  description:
    "文字数カウント、JSON整形、QRコード生成、パスワード生成など、便利なオンラインツールが全て無料。ブラウザ上で動作し、データは一切送信しません。",
  keywords: [
    "オンラインツール",
    "無料ツール",
    "文字数カウント",
    "JSON整形",
    "QRコード生成",
    "パスワード生成",
    "Base64変換",
    "URLエンコード",
    "カラーコード変換",
    "テキスト差分",
    "Markdownプレビュー",
  ],
  metadataBase: new URL("https://www.toolbox-jp.net"),
  openGraph: {
    title: "ツールボックス - 無料オンラインツール集",
    description: "便利なオンラインツールが全て無料。ブラウザ上で完結、データ送信なし。",
    type: "website",
    locale: "ja_JP",
    url: "https://www.toolbox-jp.net",
    siteName: "ツールボックス",
  },
  twitter: {
    card: "summary_large_image",
    title: "ツールボックス - 無料オンラインツール集",
    description: "便利なオンラインツールが全て無料。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://www.toolbox-jp.net",
  },
  verification: {
    google: ["1A0-02OsxiNJZzQOLn3H3CtGL08zQe2sJdz_Sgb9FpY", "aHMDAA9lE0sflXePBTc9TQAwiMT6KAN0uqqdkXzjj7A"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ツールボックス",
  url: "https://www.toolbox-jp.net",
  description: "無料で使える便利なオンラインツール集。文字数カウント、JSON整形、QRコード生成など。",
  inLanguage: "ja",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.toolbox-jp.net/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {ADSENSE_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
