import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ファビコン生成 - テキスト・絵文字からfaviconを作成",
  description: "テキストや絵文字からファビコンを簡単生成。背景色・テキスト色・形状をカスタマイズ。複数サイズ対応でダウンロード可能。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/favicon-gen" },
  openGraph: {
    title: "ファビコン生成 - テキスト・絵文字からfaviconを作成",
    description: "テキストや絵文字からファビコンを簡単生成。背景色・テキスト色・形状をカスタマイズ。複数サイズ対応でダウンロード可能。",
    url: "https://toolbox-jp.vercel.app/tools/favicon-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
