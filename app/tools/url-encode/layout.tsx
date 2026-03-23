import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URLエンコード/デコード - 無料オンラインツール",
  description: "URLエンコード・デコードを無料でオンライン変換。日本語や特殊文字を含むURLのパーセントエンコーディング変換に対応し、Web開発やSEO作業を効率化します。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/url-encode" },
  openGraph: {
    title: "URLエンコード/デコード - 無料オンラインツール",
    description: "URLエンコード・デコードを無料でオンライン変換。日本語や特殊文字のパーセントエンコーディングに対応。",
    url: "https://www.toolbox-jp.net/tools/url-encode",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
