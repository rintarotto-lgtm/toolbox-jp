import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ローマ字変換 - ひらがな・カタカナをローマ字に変換",
  description: "ひらがな・カタカナをローマ字に変換。ヘボン式・訓令式に対応。リアルタイム変換でパスポート申請や名前のローマ字表記確認に最適。無料オンラインツール。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/romaji" },
  openGraph: {
    title: "ローマ字変換 - ひらがな・カタカナをローマ字に変換",
    description: "ひらがな・カタカナをローマ字に変換。ヘボン式・訓令式対応。リアルタイム変換。",
    url: "https://toolbox-jp.vercel.app/tools/romaji",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
