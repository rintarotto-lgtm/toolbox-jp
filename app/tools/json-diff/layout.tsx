import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON比較 - 2つのJSONの差分をハイライト表示",
  description: "2つのJSONデータを比較し、追加・削除・変更されたキーをハイライト表示。ネストされたオブジェクトにも対応。差分サマリー付きの無料オンラインツール。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/json-diff" },
  openGraph: {
    title: "JSON比較 - 2つのJSONの差分をハイライト表示",
    description: "2つのJSONデータを比較し、差分をハイライト表示。追加・削除・変更を一目で確認。",
    url: "https://www.toolbox-jp.net/tools/json-diff",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
