import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "カラーパレット生成 - 配色スキームを自動生成",
  description: "ベースカラーから補色・類似色・トライアド・スプリットコンプリメンタリーの配色パレットを自動生成。HEX・RGB値のコピーに対応。無料オンラインツール。",
  alternates: { canonical: "https://toolbox-jp.net/tools/color-palette" },
  openGraph: {
    title: "カラーパレット生成 - 配色スキームを自動生成",
    description: "ベースカラーから配色パレットを自動生成。補色・類似色・トライアド対応。",
    url: "https://toolbox-jp.net/tools/color-palette",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
