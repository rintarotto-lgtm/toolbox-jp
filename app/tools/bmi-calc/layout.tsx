import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI計算 - 身長と体重からBMIを計算",
  description: "身長と体重を入力するだけでBMIを自動計算。日本肥満学会の基準でやせ〜肥満4度まで判定。理想体重も表示。無料オンラインツール。",
  alternates: { canonical: "https://toolbox-jp.net/tools/bmi-calc" },
  openGraph: {
    title: "BMI計算 - 身長と体重からBMIを計算",
    description: "身長と体重からBMIを計算。日本基準で肥満度判定。理想体重も表示。",
    url: "https://toolbox-jp.net/tools/bmi-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
