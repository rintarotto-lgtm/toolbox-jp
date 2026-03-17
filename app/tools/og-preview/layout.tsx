import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OGP画像プレビュー - SNSシェア表示確認",
  description: "URLのOGPメタタグ情報を入力して、Twitter・Facebook等でのシェア時の表示をプレビュー。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/og-preview" },
  openGraph: {
    title: "OGP画像プレビュー - SNSシェア表示確認",
    description: "URLのOGPメタタグ情報を入力して、Twitter・Facebook等でのシェア時の表示をプレビュー。",
    url: "https://toolbox-jp.vercel.app/tools/og-preview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
