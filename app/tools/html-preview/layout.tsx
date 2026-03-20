import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTMLプレビュー - HTML・CSS・JSをリアルタイムプレビュー",
  description: "HTMLコードをリアルタイムでプレビュー。CSS・JavaScriptもインラインで記述可能。分割画面で即座に結果を確認。無料オンラインツール。",
  alternates: { canonical: "https://toolbox-jp.net/tools/html-preview" },
  openGraph: {
    title: "HTMLプレビュー - HTML・CSS・JSをリアルタイムプレビュー",
    description: "HTMLコードをリアルタイムでプレビュー。CSS・JS対応。分割画面表示。",
    url: "https://toolbox-jp.net/tools/html-preview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
