import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "テキスト一括置換 - 正規表現対応文字列置換",
  description: "テキストの文字列を一括検索・置換できる無料オンラインツール。正規表現にも対応し、大量のテキスト編集や整形作業を素早く効率化。登録不要で即利用できます。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
