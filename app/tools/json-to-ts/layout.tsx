import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON→TypeScript型変換 - JSONからインターフェース自動生成 - ツールボックス",
  description: "JSONデータを貼り付けるだけでTypeScriptのインターフェース・型定義を自動生成。ネストされたオブジェクトや配列にも対応。API開発やフロントエンド開発に最適。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/json-to-ts" },
  openGraph: {
    title: "JSON→TypeScript型変換 - JSONからインターフェース自動生成 - ツールボックス",
    description: "JSONデータからTypeScriptのインターフェース・型定義を自動生成。",
    url: "https://toolbox-jp.vercel.app/tools/json-to-ts",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
