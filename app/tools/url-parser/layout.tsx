import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL解析ツール - URLの構成要素を分解表示 - ToolBox",
  description: "URLをprotocol・host・pathname・query・hash等の構成要素に分解。クエリパラメータの一覧表示も。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/url-parser" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
