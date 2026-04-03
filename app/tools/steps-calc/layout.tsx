import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "歩数・消費カロリー計算【万歩計】1日の歩数から消費カロリーを計算 | ツールボックス",
  description:
    "歩数から消費カロリー・歩行距離・脂肪燃焼量を無料計算。身長・体重・歩幅から正確な消費エネルギーを算出。ウォーキング・ジョギングのダイエット効果もシミュレーション。",
  keywords: ["歩数 消費カロリー 計算", "万歩計 カロリー", "ウォーキング カロリー", "歩数 距離 計算", "歩数 ダイエット"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/steps-calc" },
  openGraph: {
    title: "歩数・消費カロリー計算【万歩計】1日の歩数から消費カロリーを計算",
    description: "歩数から消費カロリー・歩行距離・脂肪燃焼量を無料計算。ダイエット効果もシミュレーション。",
    url: "https://www.toolbox-jp.net/tools/steps-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
