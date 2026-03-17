import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix時間変換 - 無料オンラインツール",
  description:
    "Unixタイムスタンプと日時を相互変換するオンラインツール。現在時刻のリアルタイム表示付き。ブラウザ上で完結。",
  keywords: ["Unix時間変換", "タイムスタンプ変換", "エポック秒", "UNIX時間", "Unixタイムスタンプ"],
  openGraph: {
    title: "Unix時間変換 - ツールボックス",
    description: "Unixタイムスタンプと日時を相互変換。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/unix-time",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
