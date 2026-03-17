import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSONPathテスター - JSONデータ抽出 - ツールボックス",
  description: "JSONPathやJavaScriptのアクセス式でJSONデータからの値抽出をテスト。API開発・デバッグに便利。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/json-path" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
