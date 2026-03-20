import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS圧縮・整形ツール | CSSミニファイ/フォーマッター",
  description:
    "CSSを圧縮（ミニファイ）して軽量化、または整形して可読性向上。ファイルサイズの削減率も表示。",
  keywords: ["CSS圧縮", "CSSミニファイ", "CSS整形", "CSSフォーマッター", "CSS minify"],
  openGraph: {
    title: "CSS圧縮・整形ツール | CSSミニファイ/フォーマッター",
    description:
      "CSSを圧縮（ミニファイ）して軽量化、または整形して可読性向上。ファイルサイズの削減率も表示。",
  },
  alternates: {
    canonical: "https://toolbox-jp.net/tools/css-minify",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
