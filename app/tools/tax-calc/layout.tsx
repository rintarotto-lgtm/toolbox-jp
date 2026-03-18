import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "消費税計算 - 税込み・税抜き価格を計算",
  description: "金額を入力して消費税を計算。10%・8%（軽減税率）対応。税込み→税抜き、税抜き→税込みの双方向計算。税額も個別表示。無料オンラインツール。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/tax-calc" },
  openGraph: {
    title: "消費税計算 - 税込み・税抜き価格を計算",
    description: "消費税を計算。10%・8%軽減税率対応。税込み⇔税抜きの双方向計算。",
    url: "https://toolbox-jp.vercel.app/tools/tax-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
