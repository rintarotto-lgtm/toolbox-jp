import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL整形ツール | SQLクエリフォーマッター",
  description:
    "SQLクエリを見やすく整形・フォーマット。SELECT、INSERT、UPDATE、DELETE文に対応。インデント付きで可読性アップ。",
  openGraph: {
    title: "SQL整形ツール | SQLクエリフォーマッター",
    description:
      "SQLクエリを見やすく整形・フォーマット。SELECT、INSERT、UPDATE、DELETE文に対応。",
    url: "https://toolbox-jp.net/tools/sql-formatter",
  },
  alternates: { canonical: "https://toolbox-jp.net/tools/sql-formatter" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
