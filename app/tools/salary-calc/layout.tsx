import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "給料手取り計算ツール - 年収から手取りを瞬時に計算 | ツールボックス",
  description:
    "年収から手取り額を瞬時に計算。所得税・住民税・社会保険料の内訳も一目でわかる無料ツール。2026年の税制対応。スライダーで直感的に操作。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/salary-calc",
  },
  openGraph: {
    title: "給料手取り計算ツール - 年収○○万円の手取りは？",
    description:
      "年収から手取り額を瞬時に計算。所得税・住民税・社会保険料の内訳も一目でわかる。",
    url: "https://www.toolbox-jp.net/tools/salary-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
