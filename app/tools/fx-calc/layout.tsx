import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "外貨両替・為替計算【手数料込み実質レート】海外旅行の両替シミュレーション | ツールボックス",
  description:
    "外貨両替の実質コストを無料計算。銀行・空港・コンビニATMの手数料を考慮した実際の両替レートを比較。海外旅行の費用シミュレーションにも。",
  keywords: ["外貨両替 計算", "為替 計算", "両替 手数料 計算", "海外旅行 両替", "外貨 シミュレーション"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/fx-calc" },
  openGraph: {
    title: "外貨両替・為替計算【手数料込み実質レート】海外旅行の両替シミュレーション",
    description: "外貨両替の実質コストを無料計算。銀行・空港・コンビニATMの手数料を比較。",
    url: "https://www.toolbox-jp.net/tools/fx-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
