import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ランダム生成 - 数値・文字列・色をランダム生成",
  description: "ランダムな数値・文字列・カラーコードを生成。範囲指定、文字種カスタマイズ、重複制御に対応。テストデータ作成やパスワード生成に便利な無料オンラインツール。",
  alternates: { canonical: "https://toolbox-jp.net/tools/random-gen" },
  openGraph: {
    title: "ランダム生成 - 数値・文字列・色をランダム生成",
    description: "ランダムな数値・文字列・カラーコードを瞬時に生成。テストデータ作成に便利。",
    url: "https://toolbox-jp.net/tools/random-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
