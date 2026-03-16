import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "スラッグ生成ツール | URL用スラッグ変換 - ToolBox",
  description: "日本語テキストからURL用のスラッグ（slug）を生成。ローマ字変換、ハイフン区切り、小文字化を自動で実行。",
  openGraph: { title: "スラッグ生成ツール | URL用スラッグ変換 - ToolBox", description: "テキストからURL用スラッグを自動生成。", url: "https://toolbox-jp.vercel.app/tools/slug-gen" },
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/slug-gen" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
