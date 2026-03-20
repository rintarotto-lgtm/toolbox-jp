import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdownテーブル生成ツール - 表を簡単作成",
  description: "MarkdownのテーブルをGUIで簡単作成。行・列の追加削除、アライメント設定、CSV貼り付けにも対応。",
  alternates: { canonical: "https://toolbox-jp.net/tools/md-table-gen" },
  openGraph: {
    title: "Markdownテーブル生成ツール - 表を簡単作成",
    description: "MarkdownのテーブルをGUIで簡単作成。行・列の追加削除、アライメント設定、CSV貼り付けにも対応。",
    url: "https://toolbox-jp.net/tools/md-table-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
