import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "バイト数カウント・文字コード判定 - 無料オンラインツール",
  description:
    "テキストのバイト数をUTF-8、UTF-16、Shift-JISで計算するオンラインツール。半角・全角の区別も一目でわかる。",
  keywords: ["バイト数カウント", "文字コード判定", "バイトカウント", "UTF-8", "Shift-JIS"],
  openGraph: {
    title: "バイト数カウント",
    description: "テキストのバイト数を各文字コードで計算。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/byte-counter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
