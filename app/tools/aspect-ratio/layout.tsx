import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "アスペクト比計算 - 無料オンラインツール",
  description:
    "画像・動画のアスペクト比を計算するオンラインツール。SNS推奨サイズのプリセット付き。Instagram、YouTube、Twitter対応。",
  keywords: ["アスペクト比", "アスペクト比計算", "画像サイズ", "解像度計算", "縦横比"],
  openGraph: {
    title: "アスペクト比計算",
    description: "画像・動画のアスペクト比を計算。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/aspect-ratio",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
