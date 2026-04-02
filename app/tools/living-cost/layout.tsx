import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "一人暮らしの生活費シミュレーター【2025年版】月いくら必要？ | ツールボックス",
  description: "一人暮らしの生活費を無料シミュレーション。家賃・食費・光熱費など全項目を入力→月額合計・必要年収を瞬時に計算。東京・大阪など地域別プリセット付き。新社会人・大学生に。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/living-cost",
  },
  openGraph: {
    title: "生活費シミュレーター - 一人暮らし、月いくらかかる？",
    description: "一人暮らしの生活費を項目別にシミュレーション。必要な年収もわかる無料ツール。",
    url: "https://www.toolbox-jp.net/tools/living-cost",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
