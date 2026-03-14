import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "テキスト差分比較 - 無料オンライン差分チェック",
  description: "2つのテキストの差分をオンラインで無料比較。追加・削除・変更箇所をカラーハイライトで視覚的に表示。文書の校正やソースコードの変更確認に役立ちます。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
