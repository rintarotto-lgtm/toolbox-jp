import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "消費税計算【10%・8%】税込み⇔税抜き 瞬時に計算 | ツールボックス",
  description: "消費税を即計算。金額を入力するだけで税込み・税抜きを自動表示。10%・8%軽減税率の両方に対応。税額も表示。確認・見積もりに。無料・登録不要。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/tax-calc" },
  openGraph: {
    title: "消費税計算 - 税込み・税抜き価格を計算",
    description: "消費税を計算。10%・8%軽減税率対応。税込み⇔税抜きの双方向計算。",
    url: "https://www.toolbox-jp.net/tools/tax-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
