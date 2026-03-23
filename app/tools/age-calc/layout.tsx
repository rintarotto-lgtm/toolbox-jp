import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "年齢計算 - 生年月日から年齢・和暦を計算",
  description: "生年月日から現在の年齢を年・月・日で正確に計算。生まれてからの日数、次の誕生日までのカウントダウン、和暦（令和・平成・昭和）表示にも対応。無料オンラインツール。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/age-calc" },
  openGraph: {
    title: "年齢計算 - 生年月日から年齢・和暦を計算",
    description: "生年月日から年齢を計算。年月日・日数・和暦表示。次の誕生日までのカウントダウンも。",
    url: "https://www.toolbox-jp.net/tools/age-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
