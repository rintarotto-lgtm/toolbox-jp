import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdownプレビュー - リアルタイムMarkdown変換",
  description: "Markdownをリアルタイムでプレビューできる無料オンラインツール。記述と同時にHTMLレンダリング結果を確認でき、README作成やブログ記事の執筆を効率化します。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
