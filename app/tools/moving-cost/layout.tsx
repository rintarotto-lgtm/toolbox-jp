import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "引っ越し費用計算ツール - 初期費用・業者代・総額を一括見積もり | ツールボックス",
  description:
    "引っ越しの総費用を無料で一括計算。引っ越し業者の見積もり、敷金・礼金・仲介手数料などの初期費用、家具代まで全てまとめて計算。繁忙期・通常期の料金差も自動反映。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/moving-cost",
  },
  openGraph: {
    title: "引っ越し費用計算ツール - 全部でいくらかかる？",
    description:
      "引っ越しの総費用を無料で一括計算。業者代・初期費用・家具代まで全てまとめて見積もり。",
    url: "https://www.toolbox-jp.net/tools/moving-cost",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
