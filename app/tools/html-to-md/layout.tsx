import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "HTML → Markdown変換ツール | HTMLをMDに変換",
  description: "HTMLコードをMarkdown形式に変換。ブログ記事の移行やドキュメント変換に便利。見出し・リスト・リンク・画像に対応。",
  openGraph: { title: "HTML → Markdown変換ツール", description: "HTMLをMarkdownに変換。ブログ移行やドキュメント変換に。", url: "https://www.toolbox-jp.net/tools/html-to-md" },
  alternates: { canonical: "https://www.toolbox-jp.net/tools/html-to-md" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
