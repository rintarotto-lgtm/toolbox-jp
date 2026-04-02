import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ローマ字変換【ひらがな・カタカナ→ローマ字】ヘボン式・訓令式に瞬時変換 | ツールボックス",
  description: "ひらがな・カタカナをローマ字に無料変換。ヘボン式・訓令式の両方に対応。パスポート申請・名前のローマ字表記・英語表記の確認に。入力するだけで即変換。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/romaji" },
  openGraph: {
    title: "ローマ字変換 - ひらがな・カタカナをローマ字に変換",
    description: "ひらがな・カタカナをローマ字に変換。ヘボン式・訓令式対応。リアルタイム変換。",
    url: "https://www.toolbox-jp.net/tools/romaji",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
