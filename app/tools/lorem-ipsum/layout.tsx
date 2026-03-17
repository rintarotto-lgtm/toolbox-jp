import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ダミーテキスト生成 - 無料オンラインツール",
  description:
    "日本語・英語のダミーテキスト（Lorem Ipsum）を生成するオンラインツール。デザインやレイアウト確認に最適。",
  keywords: ["ダミーテキスト", "Lorem Ipsum", "テスト文章", "サンプルテキスト", "ダミー文章"],
  openGraph: {
    title: "ダミーテキスト生成 - ツールボックス",
    description: "日本語・英語のダミーテキストを生成。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/lorem-ipsum",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
