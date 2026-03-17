import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWTデコーダー（JWT解析ツール） - 無料オンラインツール",
  description:
    "JWTトークンをHeader・Payload・Signatureに分解して表示。有効期限やクレーム情報を日本語で確認できるオンラインツール。",
  keywords: ["JWTデコード", "JWT解析", "JWTトークン", "JSON Web Token", "JWT検証"],
  openGraph: {
    title: "JWTデコーダー - ツールボックス",
    description: "JWTトークンをデコードしてHeader・Payload・Signatureを表示。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/jwt-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
