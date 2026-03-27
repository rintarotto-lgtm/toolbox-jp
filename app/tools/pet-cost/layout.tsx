import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ペット費用シミュレーター - 犬・猫の生涯費用を計算 | ツールボックス",
  description: "犬・猫を飼うのにいくらかかる？初期費用・月々のエサ代・医療費・トリミング代まで生涯費用を一括計算。飼う前に知っておきたいリアルな金額がわかる無料ツール。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/pet-cost",
  },
  openGraph: {
    title: "ペット費用シミュレーター - 犬・猫の生涯費用は？",
    description: "犬・猫を飼う費用を初期費用から生涯費用まで一括計算。",
    url: "https://www.toolbox-jp.net/tools/pet-cost",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
