import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "単位変換 - 長さ・重さ・温度・データ容量を変換",
  description: "長さ・重さ・温度・データ容量・時間の単位をリアルタイムで相互変換。メートル、キログラム、摂氏華氏、GB/MBなど幅広い単位に対応。無料オンラインツール。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/unit-converter" },
  openGraph: {
    title: "単位変換 - 長さ・重さ・温度・データ容量を変換",
    description: "長さ・重さ・温度・データ容量・時間の単位をリアルタイム変換。",
    url: "https://www.toolbox-jp.net/tools/unit-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
