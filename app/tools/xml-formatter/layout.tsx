import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML整形ツール - 無料オンラインフォーマッター",
  description: "XMLデータを見やすく整形・フォーマット。インデント付きで可読性アップ。圧縮（ミニファイ）にも対応。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/xml-formatter" },
  openGraph: {
    title: "XML整形ツール - 無料オンラインフォーマッター",
    description: "XMLデータを見やすく整形・フォーマット。インデント付きで可読性アップ。圧縮（ミニファイ）にも対応。",
    url: "https://www.toolbox-jp.net/tools/xml-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
