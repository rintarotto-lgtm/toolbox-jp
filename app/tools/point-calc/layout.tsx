import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ポイント還元率計算【クレジットカード比較】実質いくら得するか計算 | ツールボックス",
  description:
    "クレジットカードのポイント還元率から年間の獲得ポイント・お得額を無料計算。月の利用額を入力するだけで複数カードを比較。年会費を考慮した実質還元率も算出。",
  keywords: ["ポイント還元率 計算", "クレジットカード 比較 計算", "ポイント 計算", "還元率 比較", "キャッシュバック 計算"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/point-calc" },
  openGraph: {
    title: "ポイント還元率計算【クレジットカード比較】実質いくら得するか計算",
    description: "クレジットカードのポイント還元率から年間お得額を無料計算。複数カードを比較。",
    url: "https://www.toolbox-jp.net/tools/point-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
