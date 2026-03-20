import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "正規表現テスター - 無料オンラインツール",
  description:
    "正規表現パターンをリアルタイムでテストできるオンラインツール。マッチ結果をハイライト表示。JavaScript対応。",
  keywords: ["正規表現テスト", "正規表現チェッカー", "regex", "正規表現テスター", "パターンマッチ"],
  openGraph: {
    title: "正規表現テスター",
    description: "正規表現をリアルタイムテスト。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://toolbox-jp.net/tools/regex-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
