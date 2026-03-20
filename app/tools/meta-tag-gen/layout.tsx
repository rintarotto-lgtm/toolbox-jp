import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メタタグ生成ツール - SEO用HTMLメタタグジェネレーター",
  description: "SEO・SNS対応のHTMLメタタグを簡単生成。title、description、OGP、Twitter Card等を入力するだけ。",
  alternates: { canonical: "https://toolbox-jp.net/tools/meta-tag-gen" },
  openGraph: {
    title: "メタタグ生成ツール - SEO用HTMLメタタグジェネレーター",
    description: "SEO・SNS対応のHTMLメタタグを簡単生成。title、description、OGP、Twitter Card等を入力するだけ。",
    url: "https://toolbox-jp.net/tools/meta-tag-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
