import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "日時計算ツール | 日数差分・日付加算減算 - ツールボックス",
  description: "2つの日付の差分計算、日付への日数加算・減算。経過日数・残り日数の計算に便利。営業日計算にも対応。",
  openGraph: { title: "日時計算ツール | 日数差分・日付加算減算 - ツールボックス", description: "日付の差分計算や日数加算・減算。締め切り管理に便利。", url: "https://toolbox-jp.vercel.app/tools/timestamp-calc" },
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/timestamp-calc" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
