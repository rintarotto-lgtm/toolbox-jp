import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "結婚費用シミュレーター - 結婚式・新生活の総額を計算 | ツールボックス",
  description: "結婚にかかる費用を一括計算。結婚式・披露宴・新婚旅行・新生活準備まで。ご祝儀の目安や自己負担額も自動計算する無料ツール。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/wedding-cost",
  },
  openGraph: {
    title: "結婚費用シミュレーター - 結婚って全部でいくらかかる？",
    description: "結婚式・披露宴・新婚旅行・新生活の費用を一括計算。ご祝儀との差額もわかる。",
    url: "https://www.toolbox-jp.net/tools/wedding-cost",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
