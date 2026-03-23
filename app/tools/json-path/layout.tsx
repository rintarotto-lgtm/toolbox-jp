import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSONPathテスター - JSONデータ抽出",
  description: "JSONPathやJavaScriptのアクセス式でJSONデータからの値抽出をテスト。API開発・デバッグに便利。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/json-path" },
  openGraph: {
    title: "JSONPathテスター - JSONデータ抽出",
    description: "JSONPathやJavaScriptのアクセス式でJSONデータからの値抽出をテスト。API開発・デバッグに便利。",
    url: "https://www.toolbox-jp.net/tools/json-path",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
