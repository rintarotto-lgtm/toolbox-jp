import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SNS文字数チェッカー - 無料オンラインツール",
  description:
    "Twitter、Instagram、YouTube等のSNS文字数制限をリアルタイムでチェック。投稿前の文字数確認に最適。",
  keywords: ["SNS文字数", "Twitter文字数", "Instagram文字数", "文字数制限", "文字数チェッカー"],
  openGraph: {
    title: "SNS文字数チェッカー - ツールボックス",
    description: "各SNSの文字数制限をリアルタイムチェック。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/word-counter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
