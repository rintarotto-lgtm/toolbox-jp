import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "割り勘計算 - 飲み会・食事の割り勘を簡単計算",
  description: "飲み会や食事の合計金額を人数で割り勘計算。端数処理（切り上げ）対応。幹事が多く払う傾斜配分にも対応。無料オンラインツール。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/split-bill" },
  openGraph: {
    title: "割り勘計算 - 飲み会・食事の割り勘を簡単計算",
    description: "合計金額を人数で割り勘計算。端数処理・傾斜配分にも対応。",
    url: "https://toolbox-jp.vercel.app/tools/split-bill",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
