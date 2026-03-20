import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ローン計算 - 住宅ローン・借入の返済シミュレーション",
  description: "借入金額・金利・返済期間を入力してローンの月々返済額を計算。元利均等返済方式で総返済額・総利息も表示。返済スケジュール付き。無料オンラインツール。",
  alternates: { canonical: "https://toolbox-jp.net/tools/loan-calc" },
  openGraph: {
    title: "ローン計算 - 住宅ローン・借入の返済シミュレーション",
    description: "ローンの月々返済額・総返済額・総利息を計算。返済スケジュール表示付き。",
    url: "https://toolbox-jp.net/tools/loan-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
