import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "半角全角変換 - 無料オンラインツール",
  description:
    "テキストの半角・全角を一括変換するオンラインツール。英数字・記号・スペースに対応。ブラウザ上で完結、データ送信なし。",
  keywords: ["半角全角変換", "全角半角変換", "半角変換", "全角変換", "テキスト変換"],
  openGraph: {
    title: "半角全角変換 - ツールボックス",
    description: "テキストの半角・全角を一括変換。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/zen-han",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
