import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSSグラデーション生成 - 無料ジェネレーター - ツールボックス",
  description: "CSSグラデーションを視覚的に作成。線形・放射状グラデーション対応。リアルタイムプレビュー付き。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/gradient-gen" },
  openGraph: {
    title: "CSSグラデーション生成 - 無料ジェネレーター - ツールボックス",
    description: "CSSグラデーションを視覚的に作成。線形・放射状グラデーション対応。リアルタイムプレビュー付き。",
    url: "https://toolbox-jp.vercel.app/tools/gradient-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
