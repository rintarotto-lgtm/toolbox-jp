import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ハッシュ生成 - 無料オンラインツール",
  description:
    "テキストからSHA-1、SHA-256、SHA-512等のハッシュ値を生成するオンラインツール。ブラウザ上で完結、データ送信なし。",
  keywords: ["ハッシュ生成", "SHA256", "SHA-1", "SHA-512", "ハッシュ値計算"],
  openGraph: {
    title: "ハッシュ生成 - ToolBox",
    description: "SHA-256等のハッシュ値を即座に生成。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/hash-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
