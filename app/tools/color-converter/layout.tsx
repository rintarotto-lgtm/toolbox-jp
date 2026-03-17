import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "カラーコード変換 - HEX・RGB・HSL相互変換",
  description: "カラーコードをHEX・RGB・HSL形式で相互変換できる無料ツール。カラーピッカーで色を選択して即座に変換。Web制作やデザイン作業に欠かせないカラー変換ツールです。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/color-converter" },
  openGraph: {
    title: "カラーコード変換 - HEX・RGB・HSL相互変換",
    description: "カラーコードをHEX・RGB・HSL形式で相互変換。カラーピッカーで色を選択して即座に変換。",
    url: "https://toolbox-jp.vercel.app/tools/color-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
