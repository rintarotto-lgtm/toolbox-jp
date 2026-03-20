import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "絵文字検索・コピーツール | Emoji一覧から簡単コピー",
  description: "絵文字を日本語キーワードで検索してワンクリックでコピー。Slack・Twitter・LINEで使える絵文字を素早く見つける。",
  openGraph: { title: "絵文字検索・コピーツール | Emoji一覧", description: "絵文字を日本語で検索してコピー。SNSやチャットに便利。", url: "https://toolbox-jp.net/tools/emoji-search" },
  alternates: { canonical: "https://toolbox-jp.net/tools/emoji-search" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
