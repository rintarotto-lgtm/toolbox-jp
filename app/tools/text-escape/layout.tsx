import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "文字列エスケープツール | JSON・JavaScript・SQL・CSV対応 - ToolBox",
  description: "文字列のエスケープ・アンエスケープ。JSON、JavaScript、SQL、CSVなど複数の形式に対応。プログラミング作業を効率化。",
  openGraph: { title: "文字列エスケープツール | 各種フォーマット対応 - ToolBox", description: "文字列を各種フォーマットでエスケープ・アンエスケープ。", url: "https://toolbox-jp.vercel.app/tools/text-escape" },
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/text-escape" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
