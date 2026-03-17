import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTMLエスケープ/アンエスケープ - 無料オンラインツール",
  description:
    "HTML特殊文字のエスケープ・アンエスケープツール。&, <, >, \", ' を安全に変換。XSS対策にも。",
  keywords: ["HTMLエスケープ", "HTMLアンエスケープ", "特殊文字変換", "XSS対策", "HTML変換"],
  openGraph: {
    title: "HTMLエスケープ - ツールボックス",
    description: "HTML特殊文字を安全にエスケープ。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/html-escape",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
