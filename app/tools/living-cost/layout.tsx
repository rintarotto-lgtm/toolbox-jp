import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "生活費シミュレーター - 一人暮らしの月額費用を計算 | ツールボックス",
  description: "一人暮らしの生活費を項目別にシミュレーション。家賃・食費・光熱費・通信費など全項目をスライダーで簡単に計算。新社会人・大学生向けプリセットも搭載。",
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
