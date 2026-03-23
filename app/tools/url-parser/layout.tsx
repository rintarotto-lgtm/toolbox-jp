import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL解析ツール - URLの構成要素を分解表示",
  description: "URLをprotocol・host・pathname・query・hash等の構成要素に分解。クエリパラメータの一覧表示も。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/url-parser" },
  openGraph: {
    title: "URL解析ツール - URLの構成要素を分解表示",
    description: "URLをprotocol・host・pathname・query・hash等の構成要素に分解。クエリパラメータの一覧表示も。",
    url: "https://www.toolbox-jp.net/tools/url-parser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
